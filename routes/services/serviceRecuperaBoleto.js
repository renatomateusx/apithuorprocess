var express = require('express');
var router = express.Router();
var moment = require("moment");
var schedule = require('node-schedule');
const fulfillments = require('../../schemas/fulfillments');
const logistica = require('../../schemas/logisticas');
const utilisEmail = require('./utilis');
const fs = require('fs');
const path = require("path");
const constantes = require('../../resources/constantes');
const loja = require('../../schemas/integracaoPlataformas');
const lead = require('../../schemas/clientes');
const campanhas = require('../../schemas/integracaoCampanhas/campanhas');
const mensageria = require('../../schemas/mensageria');
const produtos = require('../../schemas/produtos');
const DeferredPromise = require('@bitbar/deferred-promise');
const twilio = require('../../schemas/twilio');
var LURLCartEmail = "";
//Vai rodar a cada 1 minuto


var rule = new schedule.RecurrenceRule();
rule.hour = 0;
rule.minute = 59;

var jobCartAbandon = schedule.scheduleJob("* * */21 * * * ", function () {
    //var jobCartAbandon = schedule.scheduleJob('* * * * * *', function () {
    lead.GetLeadCronJobBoleto()
        .then((resLead) => {
            resLead.forEach((objLead, i) => {
                campanhas.GetCampanhaByIDInternalBoleto(objLead.id_usuario, constantes.CONSTANTE_ID_CAMPANHA_RECUPERACAO_BOLETO)
                    .then(async (resCampanha) => {
                        LURLCartEmail = constantes.WEBSITE_CART;
                        const LLead = objLead;
                        if (LLead != null) {
                            const LData = moment(objLead.data_produtos_carrinho).format();
                            const LCampanha = objLead.campanha_enviar;
                            const LDataUltimoEnvio = objLead.data_ultimo_email_enviado;
                            var LSequenciEnviada = objLead.sequencia_enviada;
                            const LSequencia = resCampanha.sequencia;
                            const LUltimoComprados = objLead.ultimos_produtos_comprados;
                            const LDataUltimaCompra = objLead.data_ultima_compra;
                            const LEmail = objLead.email_cliente;
                            const LTelefone = objLead.telefone_cliente;
                            const LNome = objLead.nome_cliente.split(' ')[0];
                            //console.log(LSequencia);
                            if (LSequenciEnviada == null) { LSequenciEnviada = 0; }
                            var LProdutosIguais = true;// await ProcessaProdutos(LUltimoComprados, objLead.produtos);
                            //console.log("LProdutos", LProdutosIguais);
                            if (!LProdutosIguais) {
                                const LNovaSequencia = parseInt(LSequenciEnviada) + 1;
                                if (LNovaSequencia > LSequencia.sequencia.length) return;
                                const LSequenciaEnviar = LSequencia.sequencia.find(x => x.id_sequencia == LNovaSequencia);
                                if (LSequenciEnviada != undefined) {
                                    const LPodeEnviar = await PodeEnviar(moment(LData, "YYYYMMDD HH:mm:ss"), LDataUltimoEnvio, LSequenciaEnviar);
                                    if (LPodeEnviar) {
                                        const LMensagem = await mensageria.GetMensagemByIDInternal(objLead.id_usuario, LSequenciaEnviar.id_mensagem);
                                        const MensagemText = LMensagem.mensagem;
                                        const MensagemTipo = LMensagem.tipo_mensagem;
                                        const LLoja = await loja.GetLojaByUsuario(objLead.id_usuario);
                                        const LTemplate = await ProcessaTemplate(LMensagem, LLoja, LNome, objLead.url_compra, objLead.bar_code, objLead.produto_nome);
                                        //console.log('link', LTemplate.link);
                                        /*var LLEmail = 'renatomateusx@gmail.com' -- EMAIL TESTE*/
                                        var arrayAttachments = constantes.attachmentsAuxRecuperaBoleto;
                                        arrayAttachments.forEach((obj, i) => {
                                            obj.path = constantes.URL_PUBLIC_RESOURCES_EMAIL + '/' + obj.filename
                                        });
                                        var LRetornoMensagem = 0;
                                        if(MensagemTipo == constantes.TIPO_MENSAGEM_EMAIL){
                                            LRetornoMensagem = await utilisEmail.SendMail(LEmail, LTemplate.titulo, LTemplate.template, arrayAttachments, LLoja.nome_loja);
                                        }
                                        if(MensagemTipo == constantes.TIPO_MENSAGEM_SMS){
                                            const LMensagemSe = LMensagem.mensagem.replace("{first_name}", toCamelCase(LNome));
                                            LRetornoMensagem = await twilio.SendSMS(LMensagemSe, constantes.TWILIO_WHATS_APP_NUMBER, '+'+LTelefone);
                                        }
                                        if(MensagemTipo == constantes.TIPO_MENSAGEM_WHATS_APP){
                                            const LMensagemSe = LMensagem.mensagem.replace("{first_name}", toCamelCase(LNome));
                                            LRetornoMensagem = await twilio.SendWhatsApp(LMensagemSe, constantes.TWILIO_WHATS_APP_NUMBER, '+'+LTelefone);
                                        }
                                        if (LRetornoMensagem == 1) {
                                            const LUltimoEmailEnviado = moment().format();
                                            const LCampanhaEmailEnviada = resCampanha.id;
                                            const LSequenciaEnviada = LSequenciaEnviar.id_sequencia;
                                            const LUpdated = await lead.UpdateLeadCampanhaBoleto(LUltimoEmailEnviado, LCampanhaEmailEnviada, LSequenciaEnviada, objLead.id_cart);
                                            //console.log("Updated", LUpdated);
                                        }
                                        
                                        //console.log(MensagemText);
                                        //PEGAR A MENSAGEM DOM O ID DA SEQUENCIA.
                                        //MONTA O TEMPLATE
                                        //ENVIA
                                        //ATUALIZA A TABELA LEAD DAQUELE REGISTRO INFORMANDO 
                                    }
                                }
                            }
                        }
                    })
                    .catch((errorCamp) => {
                        console.log("Erro ao pegar campanha pelo pelo id do usuário", errorCamp);
                    })
                //console.log(resLead);
            })

        })
        .catch((errorLead) => {
            console.log('Erro ao pegar o Lead', errorLead);
        })

    console.log('Serviço de Carrinho Abandonado Rodando!', moment().format('HH:mm:ss'));

});

function ProcessaProdutos(produtosComprados, produtosCarrinho) {
    return new Promise((resolve, reject) => {
        try {
            var LResolve = false
            if (produtosComprados != null && produtosCarrinho != null) {
                //console.log(produtosComprados, produtosCarrinho);
                const LP = JSON.stringify(produtosComprados);
                const LC = JSON.stringify(produtosCarrinho);
                if (LP == LC) {
                    LResolve = true;
                }
            }
            resolve(LResolve);
        }
        catch (erro) {
            console.log("Erro ao processar produtos", erro);
            reject(erro);
        }
    })
}
function PodeEnviar(PDataCarrinho, PDataUltimoEnvio, PSequencia) {
    return new Promise(async (resolve, reject) => {
        try {
            var LResolve = false;
            if (PDataUltimoEnvio == null) { resolve(true); }
            PDataUltimoEnvio = moment(PDataUltimoEnvio, "YYYYMMDD HH:mm:ss")
            const TipoTempo = await GetTipoTempo(PSequencia.tipo_tempo);
            const Diff = PDataUltimoEnvio.diff(PDataCarrinho, TipoTempo.t);
            var TempoDiff = await GetTipoDiff(PSequencia.tipo_tempo, Diff);
            TempoDiff = Math.round(TempoDiff);
            //console.log("D", Diff);
            //console.log("dIFF", TempoDiff);
            if (TempoDiff >= PSequencia.tempo) {
                LResolve = true;
            }
            resolve(LResolve);
        }
        catch (erro) {
            console.log("Erro ao processar produtos", erro);
            reject(erro);
        }
    })
}

function GetTipoTempo(tipo) {
    return new Promise((resolve, reject) => {
        try {
            var LResolve = false;
            if (tipo == 1) { LResolve = { tipo: tipo, t: 'seconds' }; }
            if (tipo == 2) { LResolve = { tipo: tipo, t: 'minutes' }; }
            if (tipo == 3) { LResolve = { tipo: tipo, t: 'hours' }; }
            if (tipo == 4) { LResolve = { tipo: tipo, t: 'days' }; }
            if (tipo == 5) { LResolve = { tipo: tipo, t: 'months' }; }
            if (tipo == 6) { LResolve = { tipo: tipo, t: 'years' }; }

            resolve(LResolve);
        }
        catch (erro) {
            console.log("Erro ao processar produtos", erro);
            reject(erro);
        }
    })
}

function GetTipoDiff(tipo, diff) {
    return new Promise((resolve, reject) => {
        try {
            var LResolve = false;
            if (tipo == 1) { LResolve = moment.duration(diff).asSeconds() }
            if (tipo == 2) { LResolve = moment.duration(diff).asMinutes() }
            if (tipo == 3) { LResolve = moment.duration(diff).asHours() }
            if (tipo == 4) { LResolve = moment.duration(diff).asDays() }
            if (tipo == 5) { LResolve = moment.duration(diff).asMonths() }
            if (tipo == 6) { LResolve = moment.duration(diff).asYears() }
            resolve(LResolve);
        }
        catch (erro) {
            console.log("Erro ao processar produtos", erro);
            reject(erro);
        }
    })
}

function ProcessaTemplate(PMensagem, PDadosLoja, PNomeComprador, PLink, PBarCode, PProdutoNome) {
    return new Promise((resolve, reject) => {
        try {
            var lpromises = [];
            //console.log("Shop", promises);           
            var produto_option_id = [], produto_option_quantity = [], produto_option_variante_id = [];
            var LTemplate = {};
            var LURL = constantes.WEBSITE_CART;
            var template = path.resolve('public/templates/email-recupera-boleto.html');
            var LHTML = '';
            var HTMLArrayProd = '';
            var LTitulo = '';
            if(PProdutoNome.indexOf("|")> -1){
                const LProdutos = PProdutoNome.split('|');
                const Lengh = LProdutos.length -1;
                var produto_nome = "";
                LProdutos.forEach((objP, i)=>{
                    if(Lengh == i){
                        produto_nome += " e " + objP;
                    }
                    else{
                        produto_nome += ", " + objP;
                    }
                })
                PProdutoNome = produto_nome;
            }
            fs.readFile(template, 'utf8', async function (err, html) {
                if (err) {
                    throw err;
                }
                LHTML = html;
                var LMensagem = PMensagem.mensagem.replace("{first_name}", toCamelCase(PNomeComprador)).replace("{barcode}", PBarCode);
                LTitulo = PMensagem.titulo.replace("{first_name}", toCamelCase(PNomeComprador));
                LHTML = LHTML.replace("{merchant}", PDadosLoja.nome_loja);
                LHTML = LHTML.replace("{mensagem}", LMensagem);
                LHTML = LHTML.replace("{first_name}", toCamelCase(PNomeComprador));
                LHTML = LHTML.replace("{email_loja}", PDadosLoja.email_loja);
                LHTML = LHTML.replace("{barcode}", PBarCode);
                LHTML = LHTML.replace("{url_boleto}", PLink);
                LHTML = LHTML.replace("{produto_nome}", PProdutoNome);
                // if(PMensagem.indexOf("{products_list}") > -1){
                //NÃO IREI CONSIDERAR ISSO AGORA. SE ALGUÉM PEDIR PARA RETIRAR DO TEMPLATE, A GENTE FAZ.
                //POR HORA, TODO E QUALQUER E-MAIL DE CARRINHO ABANDONADO IRÁ COM A LISTAGEM DE PRODUTOS.
                // }
                resolve({ template: LHTML, titulo: LTitulo, link: PLink });
                
            });
        }
        catch (erro) {
            console.log("Erro ao processar produtos", erro);
            reject(erro);
        }
    })
}

function MontaDadosProduto(PProduto) {
    return new Promise(async (resolve, reject) => {

        try {
            var LURL = constantes.WEBSITE_CART;
            const LIDProdutoOption = await produtos.GetProdutoByIDThuorInternal(PProduto.id_thuor);
            resolve(LIDProdutoOption.id_produto_json);
        }
        catch (error) {
            reject(error);
        }
    })

}
function getURLProduto(id_produto, quantity, variante_cart, i) {
    return new Promise((resolve, reject) => {
        try {
            var PathLink = "produto_option_id[" + i + "]={idProd}&produto_option_quantity[" + i + "]={quantidade}&produto_option_variante_id[" + i + "]={variante}&";
            var LURLCartEmail = PathLink.replace("{idProd}", id_produto).replace("{quantidade}", quantity).replace("{variante}", variante_cart);
            resolve(LURLCartEmail);
        }
        catch (error) {
            console.log("Erro cart shopify", error);
            reject(error);
        }
    });
}

function toCamelCase(str) {
    var LSTR2 = "";
    if (str.indexOf(" ") > -1) {
        var LSpace = str.split(" ");
        LSpace.forEach((objS, i) => {
            var LStr = objS.split("");
            LStr.forEach((obj, i) => {
                if (i == 0) LSTR2 = LSTR2 + obj.toString().toUpperCase();
                if (i > 0) LSTR2 = LSTR2 + obj.toString().toLowerCase();
            });
            LSTR2 = LSTR2 + " ";
        });
    } else {
        var LStr = str.split("");
        LStr.forEach((obj, i) => {
            if (i == 0) LSTR2 = LSTR2 + obj.toString().toUpperCase();
            if (i > 0) LSTR2 = LSTR2 + obj.toString().toLowerCase();
        });
    }
    return LSTR2;
}


module.exports = router;
