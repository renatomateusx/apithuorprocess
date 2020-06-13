

const TEMPLATE_ITENS_CART = '<div class="product"> <div class="row col-md-12"> <div class="mt-2 w-100 col-md-9"> <img class="rounded img-fluid float-left imgVariant" src="{img}"/> <div class="product-name"> <div class="product-name mt-1 col-md-10"> <a class="ml-2 w-100" href="#">{title}</a> <div class="product-info"> <div> <span class="value ml-2">{variant_title}</span> </div></div><div class="product-info"> <div> <span class="value ml-2"> <small>{quantity} Unidade(s) - <b>R${variant_price}</b> </small> </span> </div></div></div></div></div><div class="col-md-2 mt-4"><span class="fa fa-trash itemCartDelete" id="{id_cart}"></span></div></div><hr/></div>';
const TEMPLATE_ITENS_FRETE = '<div class="card-default minusmargintop col-md-12 " > <div class="card-body"> <div class="form-group row formGroup"> <button type="button" class="btn btn-secondary col-md-11 pull-left float-left btnFrete classSelected" id="{id_frete}" > <p> <span class="text-left pull-left float-left col-md-10 textInfoFrete">{nome_frete}</span> </p><p> <span class="text-left pull-left float-left ml-0 col-md-10 textInfoFrete">Preço: R${{preco_frete}}</span> </p><p> <span class="text-left pull-left float-left ml-0 col-md-10"> <small>Entrega garantida</small> </span> </p></button> </div></div></div>';
//const ULR_BASE = "http://localhost:3000/";
const ULR_BASE = "https://hmlapi.thuor.com:9443/";
const ULR_BASE_WEB = "http://localhost:8081/";
const URL_END_POINT_GET_PRODUTO_BY_ID = ULR_BASE + "produtos/GetProdutoByIDThuor";
const URL_END_POINT_SAVE_REVIEW = ULR_BASE + "reviews/SaveReview";
const URL_END_POINT_GET_PRODUCT = ULR_BASE + "produtos/GetProdutoIDThuor";
const URL_END_POINT_GET_PRODUCT_IMPORTED = ULR_BASE + "produtos/GetProdutoByIDImportedCheckoutIndependente";
const URL_END_PONT_GET_CEP = ULR_BASE + "extras/ViaCEP";
const URL_END_POINT_GET_DADOS_LOJA = ULR_BASE + "integracaoShopify/GetDadosLojaByIDUsuario";
const URL_END_POINT_GET_DADOS_CHECKOUT = ULR_BASE + 'checkouts/GetCheckoutAtivo';
const URL_END_POINT_GET_FRETE = ULR_BASE + 'logisticas/GetFretes';
const URL_END_POINT_GET_PIXELS = ULR_BASE + 'pixels/GetPixels';
const URL_END_POINT_PAY_TICKET = ULR_BASE + 'checkouts/DoPayTicket';
const URL_END_POINT_PAY_CARD = ULR_BASE + 'checkouts/DoPay';
const URL_END_POINT_SAVE_LEAD = ULR_BASE + 'clientes/SaveLead';

var isShowingLoading = false;
var formValidateDadosPessoais = [];
var formValidateDadosEndereco = [];
var formValidateDadosCartao = [];
var errors = [];
var base64Image = '';
var plataforma = '';
var url_loja = window.location.host;
var id_produto_geral = '';
var rating = '';
var price = 123.45;
var decimal = ",";
var thousands = ".";
var prefix = " ";
var suffix = "";
var precision = 2;
var masked = false /* doesn't work with directive */
var DadosCheckout = {};
var produtosCart = [];
var fretes = [];
var freteSelecionado = -1;
var dadosLoja = {};
var nomeLoja = "";
var currentStep = 1;
var nome_completo = "";
var telefone = "";
var cpf = "";
var email = "";
var CEP = "";
var endereco = "";
var numero_porta = "";
var bairro = "";
var complemento = "";
var destinatario = "";
var cidade = "";
var estado = "";
var parcelas = "";
var codigo_seguranca = "";
var cpf_titular = "";
var nome_titular = "";
var validade = "";
var cardToken = "";
var card_number = "";
var payment_id = "";
var stepDadosPessoaisFinalizados = 0;
var stepDadosEnderecoFinalizados = 0;
var valorTotalCompra = 0;
var valorFrete = 0;
var formaPagamento = "any";
var ImageProcessor = "";
var vueSelectValue = "";
var totalQuantity = 0;
var granTotal = 0;
var granDesconto = 0;
var granQuantity = 0;
var granSubTotal = 0;
var descontoCupom = 0;
var produtoToSell = {};
var produtoVariantes = [];
var images = [];
var VarianteIDProdutoJSONUpSellSelected = 0;
var quantity = 1;
var VarianteIDUpSellSelected;
var VarianteImageUpSellSelected;
var VarianteSKUUpSellSelected;
var VariantePriceUpSellSelected;
var VarianteTitleUPSellSelected;
var cidadeEnd = "";
var estadoEnd = "";
var pixels = {};
var LTotal = 0;




const template = document.createElement('template');
template.innerHTML = `<div class="col-md-12 mt-5"> <div class="row mt-2"> <div class="col-md-3 mr-0 pr-0 pl-0"></div><div class="col-xl-6 ml-0 mr-0 pr-0 pl-0"> <form> <form name="form" id="form"> <div class="block-center"> <div class="container-fluid"> <div class="card shopping-cart mb-0"> <div class="card-header bg-dark text-light"> <span class="col-md-12"><strong id="pnome_loja">Thuor.com</strong></span> <div class="item-security pull-right float-right black-70 ml30 row" aria-hidden="true"> <div class="holder-icon col-md-2" style="display:none;"> <div class="fa fa-lock"></div></div><div class="text mr-2"> <div class="fa fa-lock"></div><strong class="ml-1">Pagamento</strong> <br/> <strong class="green">100% seguro</strong> </div></div></div><span class></span> <div class="badge badge-blue iconStep" style="display:none;">1</div></div><div class="row col-lg-12 col-lg-offset-2" style=" margin: 0 auto; display:block"> <div class="col-md-4 mt-0 mb-0 cardSide"> <div class="card card-default mb-3"> <div class="card-header rounded "> <div class="row"> <span class="col-md-12 mt-3 ml-2 mr-0"><strong>Escolha quais opções irá levar:</strong></span> <div class="product-info row col-md-12 text-center marginCenter" id="productOptions"></div><button id="buttonAdd" type="button" class="mt-2 btn btn-primary btn-lg btn-block float-left pull-left btnContinue ">Adicionar</button> </div></div></div><div id="formResumo" class="card card-default mb-0"> <div class="card-header rounded"> <a style="cursor:pointer!important;" data-toggle="collapse" aria-expanded="false" aria-controls="collapseResumo" id="collapseR"> <span id="collapseParent" style="margin-top: 1px!important;" class="resumoCompra pull-left float-left ml-0" role="button">Resumo</span> <small style="cursor:pointer!important; margin-top: 2px!important;" class="ml-2 text-left textItems " id="totalQuantity"> Nenhum Item </small> <small class="valorTotalCollapse pull-right float-right"> <span class="valorTotalCollapse" id="granTotal">R$ 0,00</span> <span class="fa fa-arrow-down comandoCollapse pull-right float-right" id="comandoCollapse" role="button"></span> </small> </a> <div class="col-lg-12 collapse" id="collapseResumo" data-parent="#collapseParent"> <div class="col-md-12 ValorTotalResumo mt-3"> <span class="textValorTotal col-md-12" id="granTotal2">Valor: R$ 0,00</span> </div><div class="row"> <div class="col-md-12"> <div class="items" id="items"> <span class="col-md-12 alert alert-info p-2 text-center marginCenter d-block">Seu carrinho ainda está vazio. Adicione itens para vê-los aqui.</span> </div></div></div></div></div><div class="card-body minusmargintop"></div></div></div><form class="form-horizontal " id="formCheckout"> <div class="col-md-4 col-xl-4 mt-0 mb-0 cardSide"> <div class="card card-default mb-0 hidden" id="formDadosPessoais"> <div class="card-header rounded"> <span class="badge badge-blue iconBadge">1</span> <span class="dadosPessoais">Dados Pessoais</span> <span class="fa fa-edit pull-right float-right cursorP hidden" id="editaDadosPessoaisButton" ></span> <p> <small class="textInformation col-md-10">Solicitamos somente as informações essenciais para você fazer sua compra.</small> </p></div><div class="card-body minusmargintop " id="editaDadosPessoaisLabel"> <div class="form-group row formGroup mt-3"> <label id="pnome_completo" class="col-xl-12 col-form-label labelForm dadosPessoaisNomeCompletoVModel paddingTopBottomZERO" v-show="nome_completo"></label> <label id="pemail" class="col-xl-12 col-form-label labelForm paddingTopBottomZERO" v-show="email"></label> <label id="pcpf" class="col-xl-12 col-form-label labelForm paddingTopBottomZERO" v-show="cpf"></label> <label id="ptelefone" class="col-xl-12 col-form-label labelForm paddingTopBottomZERO"></label> </div></div><div class="card-body minusmargintop" id="editaDadosPessoaisForm"> <div class="form-group row formGroup"> <label class="col-md-10 col-form-label labelForm">E-mail</label> <div class="col-xl-12"> <input autocomplete="off" class="form-control" type="email" v-model.lazy="email" id="email" placeholder="Digite seu E-mail"/> </div></div><div class="form-group row formGroup"> <label class="col-xl-12 col-form-label labelForm">Nome Completo</label> <div class="col-xl-12"> <input class="form-control required" autocomplete="off" type="text" minlength="5" v-model.lazy="nome_completo" id="nome_completo" placeholder="Digite seu nome aqui"/> </div></div><div class="form-group row formGroup"> <label class="col-xl-12 col-form-label labelForm">CPF</label> <div class="col-md-7"> <input minlength="14" maxlength="14" class="form-control required" autocomplete="off" id="cpf" type="text" v-model="cpf" placeholder="Digite seu CPF"/> </div></div><div class="form-group row formGroup"> <label class="col-xl-12 col-form-label labelForm" for="telefone">Celular / WhatsApp</label> <div class="col-xl-7 col-md-9"> <div class="input-group mb-0"> <div class="input-group-prepend"> <div class="input-group-text">+55</div></div><input class="form-control" id="telefone" type="text" minlength="15" maxlength="15" placeholder="71 9 9130-6561"/> </div></div></div><div class="form-group row mt-3"> <div class="col-xl-12"> <button class="btn btn-sm btn-primary btn-lg btn-block float-right mb-0 btnContinue" type="button" id="btnDadosPe"> Continuar <span class="fa fa-arrow-right ml-2" style="position:relative; top:1px"></span> </button> </div></div></div></div></div><div class="col-md-4 mt-0 mb-0 cardSide"> <div class="card card-default mb-0 hidden" id="formDadosEndereco"> <div class="card-header rounded"> <span class="badge badge-blue iconBadge">2</span> <span class="dadosPessoais">Entrega</span> <span class="fa fa-edit pull-right float-right cursorP hidden" id="editaDadosEnderecoButton" ></span> <p> <small class="textInformation col-md-10">Cadastre ou selecione um endereço para receber sua encomenda.</small> </p></div><div class="card-default minusmargintop hidden" id="editaDadosEnderecoLabel"> <div class="card-body"> <div class="form-group row formGroup mt-3"> <label class="col-xl-12 col-form-label labelForm enderecoEntregaHeader paddingTopBottomZERO"> <b>Endereço de Entrega:</b> </label> <label class="col-xl-12 col-form-label labelForm paddingTopBottomZERO"> <b id="penderecobairro"></b> </label> <label class="col-xl-12 col-form-label labelForm paddingTopBottomZERO" id="pcidadeestado"></label> <label class="col-xl-12 col-form-label labelForm paddingTopBottomZERO" id="pcep"></label> </div></div></div><div class="card-body minusmargintop" id="editaDadosEnderecoForm"> <div class="form-group row formGroup"> <label class="col-xl-12 col-form-label labelForm">CEP</label> <div class="col-md-7"> <input class="form-control required" autocomplete="off" type="text" id="cep" maxlength="9" placeholder="Digite seu CEP"/> </div><span class="localidade col-md-6 pull-left float-left text-left" v-show="getCidade()" id="cidadeestado"></span> </div><div class="form-group row formGroup" v-show="endereco"> <label class="col-md-12 col-form-label labelForm">Endereço</label> <div class="col-xl-12"> <input autocomplete="off" class="form-control" type="address" id="endereco" v-model="endereco" placeholder="Digite seu E-mail"/> </div></div><div class="form-group row formGroup" v-show="endereco"> <div class="col-md-6 mt-1"> <label class="col-xl-12 col-form-label labelForm paddingZero mb-1">Número</label> <input class="form-control required" autocomplete="off" type="text" id="numero_porta"/> </div><div class="col-md-6 mt-1" v-show="bairro"> <label class="col-xl-6 col-form-label labelForm paddingZero mb-1">Bairro</label> <input class="form-control required" id="bairro" autocomplete="off" type="text" v-model="bairro"/> </div></div><div class="form-group row formGroup" v-show="endereco"> <label class="col-xl-12 col-form-label labelForm">Complemento</label> <div class="col-md-12"> <input class="form-control" autocomplete="complement" id="complemento" v-model="complemento" type="text"/> </div></div><div class="form-group row formGroup" v-show="endereco"> <label class="col-xl-12 col-form-label labelForm">Destinatário</label> <div class="col-md-12"> <input class="form-control" autocomplete="receiver" id="destinatario" v-model="destinatario" type="text"/> </div></div><div class="form-group row mt-3"> <div class="col-xl-12"> <button class="btn btn-sm btn-primary btn-lg btn-block float-right mb-0 btnContinue" id="btnDadosEnd" type="button"> Continuar <span class="fa fa-arrow-right ml-2" style="position:relative; top:1px"></span> </button> </div></div></div><div class="col-md-12" id="cardFretes"></div></div></div><div class="col-md-4 mt-0 mb-0 cardSide"> <div class="card card-default mb-0 hidden" id="formDadosPagamento"> <div class="card-header rounded"> <span class="badge badge-blue iconBadge">3</span> <span class="dadosPessoais">Pagamento</span> <p> <small class="textInformation col-md-10">Escolha abaixo uma forma de pagamento.</small> </p><p class="mt-5 col-md-12"> <small class> Processado por: <strong>Mercado Pago</strong> </small> </p><div class="form-group row formGroup"> <button type="button" id="creditCard"  class="btn btn-secondary col-md-11 pull-left float-left btnFormaPagamentoSelecionada mb-2 opcaoDeselecionada"> <p> <span class="text-left pull-left float-left col-md-10">Cartão de Crédito</span> <span class="text-left pull-left float-left col-md-10"> <img src="http://github.bubbstore.com/formas-de-pagamento/visa.svg" style="width: 65px!important; height: auto"/> </span> </p><p> <span class="text-left pull-left float-left ml-0 col-md-10"> <small>Pagamento 100% seguro</small> </span> </p><p id="creditCardSel" class="hidden"> <span class="text-left pull-left float-left ml-0 col-md-10 selecionadoInfo"> <small>Selecionado</small> </span> </p></button> <div class="card-body minusmargintop hidden" id="creditCardForm"> <div class="form-group row formGroup mt-3"> <label class="col-xl-12 col-form-label labelForm"> Número do Cartão </label> <div class="col-md-7"> <input class="form-control required" autocomplete="cc-number" type="text" id="card_number" v-model="card_number"/> </div></div><div class="form-group row formGroup"> <label class="col-xl-12 col-form-label labelForm">Validade</label> <div class="col-md-5"> <input autocomplete="cc-exp" class="form-control" type="text" id="validade" v-model="validade" placeholder="MM/AA" minlength="5" maxlength="5"/> </div></div><div class="form-group row formGroup"> <label class="col-xl-12 col-form-label labelForm">Nome do Titular do Cartão</label> <div class="col-md-7"> <input class="form-control required" id="nome_titular" autocomplete="name" type="text"/> </div></div><div class="form-group row formGroup"> <label class="col-xl-12 col-form-label labelForm">Cód. de Segurança</label> <div class="col-md-5"> <input class="form-control required" id="codigo_seguranca" autocomplete="security" type="text"/> </div></div><div class="form-group row formGroup"> <label class="col-xl-12 col-form-label labelForm">CPF do Titular</label> <div class="col-md-7"> <input minlength="14" maxlength="14" class="form-control required" autocomplete="off" type="text" id="cpf_titular" placeholder="Digite seu CPF"/> </div></div><div class="form-group row formGroup"> <label class="col-xl-2 col-form-label labelForm" for="inlineFormInputGroup">Parcelas</label> <div class="col-lg-12"> <small>Informe o cartão de crédito para selecionar as parcelas</small> <select id="dropParcelas" v-model="parcelas" class="form-control" name="installments" selectedIndex="0"> <option v-bind:value="parcelas" selected="selected"> </option> </select> </div></div><div class="form-group row mt-3"> <div class="col-xl-12"> <button class="btn btn-sm btn-primary btn-lg btn-block float-right mb-0 btnContinue" id="btnBuyCard"  type="button"> <span class="fa fa-lock mr-2" style="position:relative; top:1px"></span>Comprar Agora </button> </div></div></div><button type="button" id="bolbradesco" class="btn btn-secondary col-md-11 pull-left float-left btnFormaPagamentoSelecionada opcaoDeselecionada"> <p> <span class="text-left pull-left float-left col-md-10">Boleto</span> <span class="text-left pull-left float-left col-md-10"> <img src="http://github.bubbstore.com/formas-de-pagamento/boleto-barcode.svg" style="width: 65px!important; height: auto"/> </span> </p><p> <span class="text-left pull-left float-left ml-0 col-md-10"> <small>Processamento em 3 dias.</small> </span> </p><p id="bolbradescoSel" class="hidden"> <span class="text-left pull-left float-left ml-0 col-md-10 selecionadoInfo"> <small>Selecionado</small> </span> </p></button> <div class="card-body minusmargintop hidden" id="bolbradescoForm"> <div class="form-group row mt-2"> <small class="text-justify col-md-11 smallInforFormaPagamentoBoleto">Somente quando recebermos a confirmação, em até 72h após o pagamento, seguiremos com o envio das suas compras. O prazo de entrega passa a ser contado somente após a confirmação do pagamento.</small> </div><div class="form-group row mt-2"> <span class="valorNoBoleto col-md-12 ml-1"> Valor no Boleto <strong>R$ <span id="valorTotalBoleto"></span></strong> </span> </div><div class="form-group row mt-3"> <div class="col-xl-12"> <button class="btn btn-sm btn-primary btn-lg btn-block float-right mb-0 btnContinue" id="btnBuyBoleto"  type="button"> <span class="fa fa-lock mr-2" style="position:relative; top:1px"></span>Comprar Agora </button> </div></div></div></div></div></div></div></form> </div></div></div></form> </form> </div><div class="col-md-3 mr-0 pr-0 pl-0"></div></div></div> `;
class CheckoutMP extends HTMLElement {

    constructor() {
        super();

        this._shadowRoot = this.attachShadow({ mode: 'open' });
        this.arrayCSSs.forEach((obj, i) => {
            var link = document.createElement('link');
            link.id = i;
            link.rel = 'stylesheet';
            link.type = 'text/css';
            link.href = obj.script;
            link.media = 'all';
            this._shadowRoot.appendChild(link);
        });
        this.arrayScripts.forEach((obj, i) => {
            let script = document.createElement("script");
            script.type = 'text/javascript';

            script.setAttribute(
                "src",
                obj.script
            );

            if (obj.trigger == 1) {
                script.onload = function () {
                    obj.call;
                }
            }
            this._shadowRoot.appendChild(script);
        });
        var self = this;
        window.onload = function () {
            self.ShowLoading();
            const plugin = document.createElement("script");
            plugin.onload = function () {
                console.log("Carregado Script MP");
                self.initializeFunction();
            };
            plugin.setAttribute(
                "src",
                "https://secure.mlstatic.com/sdk/javascript/v1/mercadopago.js"
            );
            plugin.async = true;
            self._shadowRoot.appendChild(plugin);
        };
        this._shadowRoot.appendChild(template.content.cloneNode(true));
    }

    get html() {
        return '<div class="col-md-12 mt-5"> <div class="row mt-2"> <div class="col-md-3 mr-0 pr-0 pl-0"></div><div class="col-xl-6 ml-0 mr-0 pr-0 pl-0"> <form> <form name="form" id="form"> <div class="block-center"> <div class="container-fluid"> <div class="card shopping-cart mb-0"> <div class="card-header bg-dark text-light"> <span class="col-md-12"><strong id="pnome_loja">Thuor.com</strong></span> <div class="item-security pull-right float-right black-70 ml30 row" aria-hidden="true"> <div class="holder-icon col-md-2" style="display:none;"> <div class="fa fa-lock"></div></div><div class="text mr-2"> <div class="fa fa-lock"></div><strong class="ml-1">Pagamento</strong> <br/> <strong class="green">100% seguro</strong> </div></div></div><span class></span> <div class="badge badge-blue iconStep" style="display:none;">1</div></div><div class="row col-lg-12 col-lg-offset-2" style=" margin: 0 auto; display:block"> <div class="col-md-4 mt-0 mb-0 cardSide"> <div class="card card-default mb-3"> <div class="card-header rounded "> <div class="row"> <span class="col-md-12 mt-3 ml-2 mr-0"><strong>Escolha quais opções irá levar</strong></span> <div class="product-info row col-md-12 text-center marginCenter" id="productOptions"></div><button  type="button" class="mt-2 btn btn-primary btn-lg btn-block float-left pull-left btnContinue ">Adicionar</button> </div></div></div><div id="formResumo" class="card card-default mb-0"> <div class="card-header rounded"> <a style="cursor:pointer!important;" data-toggle="collapse" aria-expanded="false" aria-controls="collapseResumo" id="collapseRes"> <span id="collapseParent" style="margin-top: 1px!important;" class="resumoCompra pull-left float-left ml-0" role="button">Resumo</span> <small style="cursor:pointer!important;" class="ml-2 text-left textItems " id="totalQuantity"> Nenhum Item </small> <small class="valorTotalCollapse pull-right float-right"> <span class="valorTotalCollapse" id="granTotal">R$ 0,00</span> <span class="fa fa-arrow-down comandoCollapse pull-right float-right" id="comandoCollapse" role="button"></span> </small> </a> <div class="col-lg-12 collapse" id="collapseResumo" data-parent="#collapseParent"> <div class="col-md-12 ValorTotalResumo mt-3"> <span class="textValorTotal col-md-12" id="granTotal2">Valor: R$ 0,00</span> </div><div class="row"> <div class="col-md-12"> <div class="items" id="items"> <span class="col-md-12 alert alert-info p-2 text-center marginCenter d-block">Seu carrinho ainda está vazio. Adicione itens para vê-los aqui.</span> </div></div></div></div></div><div class="card-body minusmargintop"></div></div></div><form class="form-horizontal " id="formCheckout"> <div class="col-md-4 col-xl-4 mt-0 mb-0 cardSide"> <div class="card card-default mb-0 hidden" id="formDadosPessoais"> <div class="card-header rounded"> <span class="badge badge-blue iconBadge">1</span> <span class="dadosPessoais">Dados Pessoais</span> <span class="fa fa-edit pull-right float-right cursorP hidden" id="editaDadosPessoaisButton" ></span> <p> <small class="textInformation col-md-10">Solicitamos somente as informações essenciais para você fazer sua compra.</small> </p></div><div class="card-body minusmargintop " id="editaDadosPessoaisLabel"> <div class="form-group row formGroup mt-3"> <label id="pnome_completo" class="col-xl-12 col-form-label labelForm dadosPessoaisNomeCompletoVModel paddingTopBottomZERO" v-show="nome_completo"></label> <label id="pemail" class="col-xl-12 col-form-label labelForm paddingTopBottomZERO" v-show="email"></label> <label id="pcpf" class="col-xl-12 col-form-label labelForm paddingTopBottomZERO" v-show="cpf"></label> <label id="ptelefone" class="col-xl-12 col-form-label labelForm paddingTopBottomZERO"></label> </div></div><div class="card-body minusmargintop" id="editaDadosPessoaisForm"> <div class="form-group row formGroup"> <label class="col-md-10 col-form-label labelForm">E-mail</label> <div class="col-xl-12"> <input autocomplete="off" class="form-control" type="email" v-model.lazy="email" id="email" placeholder="Digite seu E-mail"/> </div></div><div class="form-group row formGroup"> <label class="col-xl-12 col-form-label labelForm">Nome Completo</label> <div class="col-xl-12"> <input class="form-control required" autocomplete="off" type="text" minlength="5" v-model.lazy="nome_completo" id="nome_completo" placeholder="Digite seu nome aqui"/> </div></div><div class="form-group row formGroup"> <label class="col-xl-12 col-form-label labelForm">CPF</label> <div class="col-md-7"> <input onchange="maskCPF()" onblur="saveLead()" minlength="14" maxlength="14" class="form-control required" autocomplete="off" id="cpf" type="text" v-model="cpf" placeholder="Digite seu CPF"/> </div></div><div class="form-group row formGroup"> <label class="col-xl-12 col-form-label labelForm" for="telefone">Celular / WhatsApp</label> <div class="col-xl-7 col-md-9"> <div class="input-group mb-0"> <div class="input-group-prepend"> <div class="input-group-text">+55</div></div><input class="form-control" id="telefone" type="text" minlength="15" maxlength="15" onchange="maskTelefone()" placeholder="71 9 9130-6561"/> </div></div></div><div class="form-group row mt-3"> <div class="col-xl-12"> <button class="btn btn-sm btn-primary btn-lg btn-block float-right mb-0 btnContinue"  type="button"> Continuar <span class="fa fa-arrow-right ml-2" style="position:relative; top:1px"></span> </button> </div></div></div></div></div><div class="col-md-4 mt-0 mb-0 cardSide"> <div class="card card-default mb-0 hidden" id="formDadosEndereco"> <div class="card-header rounded"> <span class="badge badge-blue iconBadge">2</span> <span class="dadosPessoais">Entrega</span> <span class="fa fa-edit pull-right float-right cursorP hidden" id="editaDadosEnderecoButton" ></span> <p> <small class="textInformation col-md-10">Cadastre ou selecione um endereço para receber sua encomenda.</small> </p></div><div class="card-default minusmargintop hidden" id="editaDadosEnderecoLabel"> <div class="card-body"> <div class="form-group row formGroup mt-3"> <label class="col-xl-12 col-form-label labelForm enderecoEntregaHeader paddingTopBottomZERO"> <b>Endereço de Entrega:</b> </label> <label class="col-xl-12 col-form-label labelForm paddingTopBottomZERO"> <b id="penderecobairro"></b> </label> <label class="col-xl-12 col-form-label labelForm paddingTopBottomZERO" id="pcidadeestado"></label> <label class="col-xl-12 col-form-label labelForm paddingTopBottomZERO" id="pcep"></label> </div></div></div><div class="card-body minusmargintop" id="editaDadosEnderecoForm"> <div class="form-group row formGroup"> <label class="col-xl-12 col-form-label labelForm">CEP</label> <div class="col-md-7"> <input onchange="consultaCEP()" class="form-control required" autocomplete="off" type="text" id="cep" maxlength="9" placeholder="Digite seu CEP"/> </div><span class="localidade col-md-6 pull-left float-left text-left" v-show="getCidade()" id="cidadeestado"></span> </div><div class="form-group row formGroup" v-show="endereco"> <label class="col-md-12 col-form-label labelForm">Endereço</label> <div class="col-xl-12"> <input autocomplete="off" class="form-control" type="address" id="endereco" v-model="endereco" placeholder="Digite seu E-mail"/> </div></div><div class="form-group row formGroup" v-show="endereco"> <div class="col-md-6 mt-1"> <label class="col-xl-12 col-form-label labelForm paddingZero mb-1">Número</label> <input class="form-control required" autocomplete="off" type="text" id="numero_porta"/> </div><div class="col-md-6 mt-1" v-show="bairro"> <label class="col-xl-6 col-form-label labelForm paddingZero mb-1">Bairro</label> <input class="form-control required" id="bairro" autocomplete="off" type="text" v-model="bairro"/> </div></div><div class="form-group row formGroup" v-show="endereco"> <label class="col-xl-12 col-form-label labelForm">Complemento</label> <div class="col-md-12"> <input class="form-control" autocomplete="complement" id="complemento" v-model="complemento" type="text"/> </div></div><div class="form-group row formGroup" v-show="endereco"> <label class="col-xl-12 col-form-label labelForm">Destinatário</label> <div class="col-md-12"> <input class="form-control" autocomplete="receiver" id="destinatario" v-model="destinatario" type="text"/> </div></div><div class="form-group row mt-3"> <div class="col-xl-12"> <button class="btn btn-sm btn-primary btn-lg btn-block float-right mb-0 btnContinue"  type="button"> Continuar <span class="fa fa-arrow-right ml-2" style="position:relative; top:1px"></span> </button> </div></div></div><div class="col-md-12" id="cardFretes"></div></div></div><div class="col-md-4 mt-0 mb-0 cardSide"> <div class="card card-default mb-0 hidden" id="formDadosPagamento"> <div class="card-header rounded"> <span class="badge badge-blue iconBadge">3</span> <span class="dadosPessoais">Pagamento</span> <p> <small class="textInformation col-md-10">Escolha abaixo uma forma de pagamento.</small> </p><p class="mt-5 col-md-12"> <small class> Processado por: <strong>Mercado Pago</strong> </small> </p><div class="form-group row formGroup"> <button type="button" id="creditCard"  class="btn btn-secondary col-md-11 pull-left float-left btnFormaPagamentoSelecionada mb-2 opcaoDeselecionada"> <p> <span class="text-left pull-left float-left col-md-10">Cartão de Crédito</span> <span class="text-left pull-left float-left col-md-10"> <img src="http://github.bubbstore.com/formas-de-pagamento/visa.svg" style="width: 65px!important; height: auto"/> </span> </p><p> <span class="text-left pull-left float-left ml-0 col-md-10"> <small>Pagamento 100% seguro</small> </span> </p><p id="creditCardSel" class="hidden"> <span class="text-left pull-left float-left ml-0 col-md-10 selecionadoInfo"> <small>Selecionado</small> </span> </p></button> <div class="card-body minusmargintop hidden" id="creditCardForm"> <div class="form-group row formGroup mt-3"> <label class="col-xl-12 col-form-label labelForm"> Número do Cartão </label> <div class="col-md-7"> <input onchange="verificaDigitosCartao()" class="form-control required" autocomplete="cc-number" type="text" id="card_number" v-model="card_number"/> </div></div><div class="form-group row formGroup"> <label class="col-xl-12 col-form-label labelForm">Validade</label> <div class="col-md-5"> <input onchange="maskValidade()" autocomplete="cc-exp" class="form-control" type="text" id="validade" v-model="validade" placeholder="MM/AA" minlength="5" maxlength="5"/> </div></div><div class="form-group row formGroup"> <label class="col-xl-12 col-form-label labelForm">Nome do Titular do Cartão</label> <div class="col-md-7"> <input class="form-control required" id="nome_titular" autocomplete="name" type="text"/> </div></div><div class="form-group row formGroup"> <label class="col-xl-12 col-form-label labelForm">Cód. de Segurança</label> <div class="col-md-5"> <input class="form-control required" id="codigo_seguranca" autocomplete="security" type="text"/> </div></div><div class="form-group row formGroup"> <label class="col-xl-12 col-form-label labelForm">CPF do Titular</label> <div class="col-md-7"> <input onchange="maskCPFTitular()" minlength="14" maxlength="14" class="form-control required" autocomplete="off" type="text" id="cpf_titular" placeholder="Digite seu CPF"/> </div></div><div class="form-group row formGroup"> <label class="col-xl-2 col-form-label labelForm" for="inlineFormInputGroup">Parcelas</label> <div class="col-lg-12"> <small>Informe o cartão de crédito para selecionar as parcelas</small> <select id="dropParcelas" v-model="parcelas" class="form-control" name="installments" selectedIndex="0"> <option v-bind:value="parcelas" selected="selected"> </option> </select> </div></div><div class="form-group row mt-3"> <div class="col-xl-12"> <button class="btn btn-sm btn-primary btn-lg btn-block float-right mb-0 btnContinue"  type="button"> <span class="fa fa-lock mr-2" style="position:relative; top:1px"></span>Comprar Agora </button> </div></div></div><button type="button" id="bolbradesco" class="btn btn-secondary col-md-11 pull-left float-left btnFormaPagamentoSelecionada opcaoDeselecionada"> <p> <span class="text-left pull-left float-left col-md-10">Boleto</span> <span class="text-left pull-left float-left col-md-10"> <img src="http://github.bubbstore.com/formas-de-pagamento/boleto-barcode.svg" style="width: 65px!important; height: auto"/> </span> </p><p> <span class="text-left pull-left float-left ml-0 col-md-10"> <small>Processamento em 3 dias.</small> </span> </p><p id="bolbradescoSel" class="hidden"> <span class="text-left pull-left float-left ml-0 col-md-10 selecionadoInfo"> <small>Selecionado</small> </span> </p></button> <div class="card-body minusmargintop hidden" id="bolbradescoForm"> <div class="form-group row mt-2"> <small class="text-justify col-md-11 smallInforFormaPagamentoBoleto">Somente quando recebermos a confirmação, em até 72h após o pagamento, seguiremos com o envio das suas compras. O prazo de entrega passa a ser contado somente após a confirmação do pagamento.</small> </div><div class="form-group row mt-2"> <span class="valorNoBoleto col-md-12 ml-1"> Valor no Boleto <strong>R$ <span id="valorTotalBoleto"></span></strong> </span> </div><div class="form-group row mt-3"> <div class="col-xl-12"> <button class="btn btn-sm btn-primary btn-lg btn-block float-right mb-0 btnContinue"  type="button"> <span class="fa fa-lock mr-2" style="position:relative; top:1px"></span>Comprar Agora </button> </div></div></div></div></div></div></div></form> </div></div></div></form> </form> </div><div class="col-md-3 mr-0 pr-0 pl-0"></div></div></div>'
    }
    get css() {
        return `.marginCenter{margin:0auto!important;}.loader{position:relative;display:inline-block;width:50px;height:50px;vertical-align:middle;}.loader-barsspan,.loader-bars:after,.loader-bars:before{content:'';display:block;position:absolute;left:0;top:0;width:10px;height:30px;background-color:#23b7e5;-webkit-animation:grow1.5slinearinfinite;animation:grow1.5slinearinfinite}.loader-bars:after{left:15px;-webkit-animation:grow1.5slinear-.5sinfinite;animation:grow1.5slinear-.5sinfinite}.loader-barsspan{left:30px;-webkit-animation:grow1.5slinear-1sinfinite;animation:grow1.5slinear-1sinfinite}@-webkit-keyframesgrow{0%{-webkit-transform:scaleY(0);transform:scaleY(0);opacity:0}50%{-webkit-transform:scaleY(1);transform:scaleY(1);opacity:1}100%{-webkit-transform:scaleY(0);transform:scaleY(0);opacity:0}}@keyframesgrow{0%{-webkit-transform:scaleY(0);transform:scaleY(0);opacity:0}50%{-webkit-transform:scaleY(1);transform:scaleY(1);opacity:1}100%{-webkit-transform:scaleY(0);transform:scaleY(0);opacity:0}}@-webkit-keyframesspin{0%{-webkit-transform:rotate(0);tranform:rotate(0)}100%{-webkit-transform:rotate(360deg);tranform:rotate(360deg)}}@keyframesspin{0%{-webkit-transform:rotate(0);transform:rotate(0)}100%{-webkit-transform:rotate(360deg);transform:rotate(360deg)}}@-webkit-keyframesspinreverse{0%{-webkit-transform:rotate(0);tranform:rotate(0)}100%{-webkit-transform:rotate(-360deg);tranform:rotate(-360deg)}}@keyframesspinreverse{0%{-webkit-transform:rotate(0);transform:rotate(0)}100%{-webkit-transform:rotate(-360deg);transform:rotate(-360deg)}}.swal-wide{width:280px!important;height:150px;}.loadingSwall{border-color:#23b7e5!important;width:80px!important;height:80px!important;margin-bottom:20px;}.widthLoadingDiv{display:block;width:15%!important;margin:0auto!important; color: #5d9cec!important}.text-aguard{font-size:35px;top:0px!important;position:relative;margin:0auto;padding:0;color:#23b7e5!important;}.card-flat{margin-top:80px!important;}.bg-dark{background-color:#23b7e5!important;}.footerText{font-size:12px!important;}.custom-file-label::after{content:"Procurar"!important;height:100%!important;}.cursorP{cursor:pointer!important;}.starFulFill{color:gold;margin-left:5px!important;}.starNotFulFill{color:white;}.alertErros{margin-top:0px!important;padding:5px!important;}.success{color:green;font-size:15px!important;}.danger{color:red;font-size:15px!important;}input[file-upload-button]{background-color:#3498db;border-radius:5px;color:#fff;cursor:pointer;margin:10px;padding:6px20px}/*Aparênciaqueteráoseletordearquivo*/.hidden{display:none!important;}.checkedBuy{color:green;font-size:20px!important;}.noopen{text-decoration:none!important;}.fontName{font-size:21px!important;margin-left:0px!important;left:0!important;}.imageThumb{margin:0auto!important;display:block!important;}fieldset,label{margin:0;padding:0;}body{margin:20px;}h1{font-size:1.5em;margin:10px;}/******StyleStarRatingWidget*****/.rating{border:none;float:left;}.rating>input{display:none;}.rating>label:before{margin:5px;font-size:1.25em;font-family:FontAwesome;display:inline-block;content:"\f005";}.rating>.half:before{content:"\f089";position:absolute;}.rating>label{color:#ddd;float:right;}/*****CSSMagictoHighlightStarsonHover*****/.rating>input:checked~label,/*showgoldstarwhenclicked*/.rating:not(:checked)>label:hover,/*hovercurrentstar*/.rating:not(:checked)>label:hover~label{color:gold;}/*hoverpreviousstarsinlist*/.rating>input:checked+label:hover,/*hovercurrentstarwhenchangingrating*/.rating>input:checked~label:hover,.rating>label:hover~input:checked~label,/*lightencurrentselection*/.rating>input:checked~label:hover~label{color:gold;}.fontf{color:gold;}.imageDisplayOff{display:none!important;}.imageDisplayOn{display:block!important;}.card-flat{margin-top:80px!important;}.bg-dark{background-color:#23b7e5!important;}.btn-outline-info{color:white;border-color:white;}.green{color:green!important;}.holder-icon{left:0;position:absolute;top:15px;font-size:22px;}.remove{position:relative;top:33px;cursor:pointer;}.center{text-align:center;display:block;}.QuatroCincopx{width:45px!important;}.compare{color:red;font-weight:700;}.priceReal{color:green;font-weight:700;}.desconto{color:blue;font-weight:700;}.btnIncrementDecrement{height:21px;}.spanIncrementDecrement{top:-6px;margin:0auto;position:relative;}.cursorP{cursor:pointer!important;}.btnKeepBuyingFooter{color:#5d9cec;border-color:#5d9cec;}.iconBadge{background-color:#5d9cec;font-size:15px;color:white;}.iconStep{border-radius:50px;width:50px;height:50px;margin:0auto;display:block;color:white;background-color:#5d9cec;text-align:center;font-size:34px;margin-top:5px;line-height:normal;}.dadosPessoais{font-size:20px;font-weight:900;top:1px;position:relative;color:#5d9cec;margin-left:10px;}.resumoCompra{font-size:16px;font-weight:900;top:1px;position:relative;color:#5d9cec;margin-left:10px;}.comandoCollapse{margin-left:5px;top:2px;position:relative;color:dodgerblue;font-size:17px;}.labelForm{margin:000px;color:#4d4d4d;font-weight:700;}.formGroup{margin-bottom:0rem;}.card-default{border-color:#5d9cec;}.cardSide{padding:05px;box-sizing:border-box;border-radius:50px;display:inline!important;}.textInformation{line-height:14px;color:#999!important;padding:0;padding-left:30px;float:left;font-size:11px;margin-bottom:10px;}.minusmargintop{margin-top:-30px!important;}.box-title{position:relative;padding:030px035px;box-sizing:border-box;}.card-default{border-radius:7px;}.btnContinue{height:50px;font-size:20px;border-radius:10px;}.rounded{border-radius:7px!important;}.disabledBox{cursor:default;pointer-events:none;-moz-opacity:0.6;-khtml-opacity:0.6;-webkit-opacity:0.6;opacity:0.6;}.paddingZero{padding:0;}.localidade{top:5px!important;font-size:12px;}.dadosPessoaisNomeCompletoVModel{color:#4d4d4d!important;font-weight:700!important;font-size:15px;}.paddingTopBottomZERO{padding-bottom:0px!important;padding-top:0px!important;}.enderecoEntregaHeader{font-size:15px;font-weight:700;color:grey;}.opcaoSelecionada{background-color:#dcdcdc!important;color:black!important;font-weight:bold!important;border-color:#dcdcdc!important;border:2pxsolid#ccc!important;}.opcaoDeselecionada{font-weight:bold!important;color:gray!important;border-color:2pxsolid#23b7e5!important;background-color:white!important;}.btnFrete{padding:15px;margin:10px;cursor:pointer!important;border-radius:10px;}.btnFormaPagamentoSelecionada{padding:5px;margin:5px;cursor:pointer!important;border-radius:10px;margin:0auto!important;margin-bottom:10px!important;}.smallInforFormaPagamentoBoleto{margin:0auto!important;padding:5px;margin:5px;cursor:pointer!important;border-radius:10px;color:black;background-color:#dcdcdc;border:2pxsolid#ccc;}.selecionadoInfo{margin-top:10px;color:blueviolet;text-align:right!important;float:right!important;}.ValorTotalResumo{background-color:#f5f5f5;border-radius:9px;height:40px;color:white!important;}.textValorTotal{color:black;font-weight:700;font-size:1.2em;display:block;margin:0auto;text-align:center;top:5px;float:left!important;}.textItems{color:black;margin-bottom:5px!important;}.imgVariant{width:50px;height:50px;top:7px;position:relative;}.textInfoFrete{text-align:left;font-size:11px;white-space:pre-wrap;}.imageCard{width:25px!important;height:25px!important;}.valorTotalCollapse{font-weight:700;color:#3fc583!important;font-size:15px;}.hidden{display:none!important;}@mediaonlyscreenand(max-width:992px){#btnTop{display:block!important;}.valorTotalCollapse{font-weight:700;color:#3fc583!important;font-size:11px!important;top:3px!important;position:relative;}.resumoCompra{font-size:13px!important;}.comandoCollapse{margin-left:5px;top:0px!important;position:relative;color:dodgerblue;font-size:15px!important;}}@mediaonlyscreenand(max-width:767px){.QuatroCincopx{margin-left:0px!important;}.remove{float:left;left:60px;position:relative;top:-54px;cursor:pointer;font-size:25px;}.valorTotalCollapse{font-weight:700;color:#3fc583;font-size:11px!important;top:3px!important;position:relative;}.resumoCompra{font-size:13px!important;}.comandoCollapse{margin-left:5px;top:0px!important;position:relative;color:dodgerblue;font-size:15px!important;}.textItems{position:relative;top:0px!important;}}`;
    }

    get arrayCSSs() {
        return [
            { script: 'https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css' },
            { script: 'https://cdnjs.cloudflare.com/ajax/libs/limonte-sweetalert2/8.11.8/sweetalert2.min.css' },
            { script: './styleck.css' },
            { script: 'https://maxcdn.bootstrapcdn.com/font-awesome/4.2.0/css/font-awesome.min.css' }
        ];
    }
    get arrayScripts() {
        return [
            { script: 'https://unpkg.com/axios/dist/axios.min.js', trigger: 0 },
            { script: 'https://code.jquery.com/jquery-3.2.1.slim.min.js', trigger: 0 },
            { script: 'https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/js/bootstrap.min.js', trigger: 0 },
            { script: 'https://cdnjs.cloudflare.com/ajax/libs/limonte-sweetalert2/8.11.8/sweetalert2.all.min.js', trigger: 0 },
            { script: 'https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.12.9/umd/popper.min.js', trigger: 0 },
            { script: 'https://use.fontawesome.com/aa8f958ac7.js', trigger: 0 },
            { script: 'https://kit.fontawesome.com/2ecd77a85b.js', trigger: 0 }
        ];
    }

    getDadosLoja(id) {
        this.postAxios(URL_END_POINT_GET_DADOS_LOJA, { id_usuario: id }, (response) => {
            dadosLoja = response.data;

            this.postAxios(URL_END_POINT_GET_DADOS_CHECKOUT, { id_usuario: id }, (responseCheckout) => {
                DadosCheckout = responseCheckout.data;
                window.Mercadopago.setPublishableKey(DadosCheckout.chave_publica);
            });

        })
    }
    ShowLoading() {
        this.isShowingLoading = true;
        Swal.fire({
            customClass: 'swal-wide',
            title: '<span class="text-aguard" style="color: #5d9cec!important;">Aguarde...</span>',
            html: " <div class='card-body align-items-center justify-content-center'>             <div style='color: #5d9cec!important;' class='fa-5x fa fa-spinner fa-spin widthLoadingDiv'>    </div>        </div>",
            showConfirmButton: false,
            showCancelButton: false,
            allowEnterKey: false,
            allowEscapeKey: false,
            allowOutsideClick: false,
            timerProgressBar: true,
            onBeforeOpen: () => {
                // Swal.showLoading();          
            },
            onClose: () => {

            }
        })
    }
    HideLoading() {
        if (this.isShowingLoading) {
            Swal.close();
            this.isShowingLoading = false;
        }
    }

    postAxios(url, data, success) {
        axios.post(url, data)
            .then(function (response) {
                success(response);
            })
            .catch(function (error) {
                console.log('Erro ao executar Axios', error);
            });
    }

    getAxios(url, success) {
        axios.get(url)
            .then(function (response) {
                // handle success
                console.log(response);
            })
            .catch(function (error) {
                // handle error
                console.log(error);
            })
            .finally(function () {
                // always executed
            });
    }

    getPixels(id_u) {
        this.postAxios(URL_END_POINT_GET_PIXELS, { id_usuario: id_u }, (response) => {
            pixels = response.data;
            this.InsertScriptGoogle(pixels);
            this.InsertScriptFace(pixels);
        });

    }

    /* ADICIONEI NOVAS AQUI */
    getDadosLoja(id) {
        this.postAxios(URL_END_POINT_GET_DADOS_LOJA, { id_usuario: id }, (response) => {
            dadosLoja = response.data;

            this.postAxios(URL_END_POINT_GET_DADOS_CHECKOUT, { id_usuario: id }, (responseCheckout) => {
                DadosCheckout = responseCheckout.data;
                window.Mercadopago.setPublishableKey(DadosCheckout.chave_publica);
            });

        })
    }

    getFieldValue(campo) {
        return new Promise((resolve, reject) => {
            try {
                const LFV = this._shadowRoot.getElementById(campo);
                if (LFV && LFV.value) { console.log(LFV.value); resolve(LFV.value); }
                resolve(null);
            }
            catch (error) {
                console.log("Erro ao pegar o valor do campo: ", campo, error);
                reject(error);
            }
        })

    }

    checkField(campo) {
        const LV = this._shadowRoot.getElementById(campo);
        return LV && !LV.value;
    }
    getFieldName(nome) {
        var aux;
        var auxx = "";
        if (nome == 'avaliacao') return 'Avaliação';
        if (nome.indexOf("_") > -1) {
            aux = nome.split("_");
            aux.forEach((obj, i) => {
                auxx = auxx + obj + " ";
            })
            nome = auxx;
        }
        return this.toCamelCase(nome);
    }
    toCamelCase(str) {
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

    finalizaStepOne() {
        const editaDadosPessoaisForm = this._shadowRoot.getElementById("editaDadosPessoaisForm");
        const editaDadosPessoaisLabel = this._shadowRoot.getElementById("editaDadosPessoaisLabel");
        const editaDadosPessoaisButton = this._shadowRoot.getElementById("editaDadosPessoaisButton");

        this._shadowRoot.getElementById("pnome_completo").innerHTML = this._shadowRoot.getElementById("nome_completo").value;
        this._shadowRoot.getElementById("pemail").innerHTML = this._shadowRoot.getElementById("email").value;
        this._shadowRoot.getElementById("pcpf").innerHTML = this._shadowRoot.getElementById("cpf").value;
        this._shadowRoot.getElementById("ptelefone").innerHTML = this._shadowRoot.getElementById("telefone").value;

        editaDadosPessoaisLabel.classList.remove("hidden");
        editaDadosPessoaisForm.classList.add("hidden");
        editaDadosPessoaisButton.classList.remove("hidden");
    }
    editarDadosPessoais() {
        currentStep = 1;
        const editaDadosPessoaisForm = this._shadowRoot.getElementById("editaDadosPessoaisForm");
        const editaDadosPessoaisLabel = this._shadowRoot.getElementById("editaDadosPessoaisLabel");
        const editaDadosPessoaisButton = this._shadowRoot.getElementById("editaDadosPessoaisButton");
        editaDadosPessoaisLabel.classList.add("hidden");
        editaDadosPessoaisForm.classList.remove("hidden");
        editaDadosPessoaisButton.classList.add("hidden");
    }
    finalizaStepTwo() {
        const editaDadosEnderecoForm = this._shadowRoot.getElementById("editaDadosEnderecoForm");
        const editaDadosEnderecoLabel = this._shadowRoot.getElementById("editaDadosEnderecoLabel");
        const editaDadosEnderecoButton = this._shadowRoot.getElementById("editaDadosEnderecoButton");

        this._shadowRoot.getElementById("penderecobairro").innerHTML = this._shadowRoot.getElementById("endereco").value + " - " + this._shadowRoot.getElementById("bairro").value;
        this._shadowRoot.getElementById("pcidadeestado").innerHTML = cidadeEnd + " - " + estadoEnd;
        this._shadowRoot.getElementById("pcep").innerHTML = "CEP: " + this._shadowRoot.getElementById("cep").value;

        editaDadosEnderecoLabel.classList.remove("hidden");
        editaDadosEnderecoForm.classList.add("hidden");
        editaDadosEnderecoButton.classList.remove("hidden");
        this.GetFretes();
    }
    editarDadosEndereco() {
        currentStep = 2;
        const editaDadosEnderecoForm = this._shadowRoot.getElementById("editaDadosEnderecoForm");
        const editaDadosEnderecoLabel = this._shadowRoot.getElementById("editaDadosEnderecoLabel");
        const editaDadosEnderecoButton = this._shadowRoot.getElementById("editaDadosEnderecoButton");

        editaDadosEnderecoLabel.classList.add("hidden");
        editaDadosEnderecoForm.classList.remove("hidden");
        editaDadosEnderecoButton.classList.add("hidden");
    }

    validateMyForm() {
        errors = [];
        if (currentStep == 1) {
            formValidateDadosPessoais.forEach((obj, i) => {
                if (obj.required == true && this.checkField(obj.nome)) {
                    errors.push({ field: obj.nome, mensagem: 'Campo ' + this.getFieldName(obj.nome) + ' é Obrigatório.' });
                }
            });
            this.saveLead();
        }
        if (currentStep == 2) {
            formValidateDadosEndereco.forEach((obj, i) => {
                if (obj.required == true && this.checkField(obj.nome)) {
                    errors.push({ field: obj.nome, mensagem: 'Campo ' + this.getFieldName(obj.nome) + ' é Obrigatório.' });
                }
            });
            this.saveLead();
        }
        if (currentStep == 3 && formaPagamento == "bolbradesco") {
            this.saveLead();
        }
        if (currentStep == 3 && formaPagamento == "creditCard") {
            formValidateDadosCartao.forEach((obj, i) => {
                if (obj.required == true && this.checkField(obj.nome)) {
                    errors.push({ field: obj.nome, mensagem: 'Campo ' + this.getFieldName(obj.nome) + ' é Obrigatório.' });
                }
            });
            this.saveLead();
        }

        const alertErros = this._shadowRoot.getElementById("alertErros");
        const alert = this._shadowRoot.getElementById("alertReturn");
        if (errors.length > 0) {
            this.showNotificationW('Oops!', errors[0].mensagem, 'error');
            return false;
        }
        else {
            if (currentStep == 1) {
                this.finalizaStepOne();
            }
            if (currentStep == 2) {
                this.finalizaStepTwo();
            }
            if (currentStep == 3 && errors.length == 0) {
                //AQUI SALVA
                if (formaPagamento == "bolbradesco") {
                    this.iniciaPagamentoBackEndBoleto();
                }
                if (formaPagamento == "creditCard") {
                    this.iniciaPagamentoBackEndCard();
                }
            }
            if (currentStep < 3) {
                currentStep = currentStep + 1;
            }
            return true;
        }

    }

    getAjax(url, success) {
        var xhr = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject('Microsoft.XMLHTTP');
        xhr.open('GET', url);
        xhr.onreadystatechange = function () {
            if (xhr.readyState > 3 && xhr.status == 200) success(xhr.responseText);
        };
        xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
        xhr.send();
        return xhr;
    }

    postAxios(url, data, success) {
        axios.post(url, data)
            .then(function (response) {
                success(response);
            })
            .catch(function (error) {
                console.log('Erro ao executar Axios', error);
            });
    }

    getAxios(url, success) {
        axios.get(url)
            .then(function (response) {
                // handle success
                console.log(response);
            })
            .catch(function (error) {
                // handle error
                console.log(error);
            })
            .finally(function () {
                // always executed
            });
    }

    ShowLoadingT(text) {
        this.isShowingLoading = true;
        Swal.fire({
            customClass: 'swal-wide',
            title: '<span class="text-aguard">' + text + '</span>',
            html: " <div class='card-body align-items-center justify-content-center'>             <div class='ball-scale-ripple-multiple widthLoadingDiv'>                <div class='loadingSwall'></div>               <div class='loadingSwall'></div>                <div class='loadingSwall'></div>            </div>        </div>",
            showConfirmButton: false,
            showCancelButton: false,
            allowEnterKey: false,
            allowEscapeKey: false,
            allowOutsideClick: false,
            timerProgressBar: true,
            onBeforeOpen: () => {
                // Swal.showLoading();          
            },
            onClose: () => {

            }
        })
    }

    showNotification(message, type) {
        const Toast = Swal.mixin({
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 3500,
            timerProgressBar: true,
            onOpen: (toast) => {
                toast.addEventListener('mouseenter', Swal.stopTimer)
                toast.addEventListener('mouseleave', Swal.resumeTimer)
            }
        })

        Toast.fire({
            icon: type,
            title: message
        })
    }

    showNotificationW(title, message, type) {
        Swal.fire(
            title,
            message,
            type
        );
    }
    async saveLead() {
        var LLead = await this.getDadosPagamentoTransacao();
        let LBody = {
            id_usuario: dadosLoja.id_usuario,
            email: this._shadowRoot.getElementById("email").value,
            nome: this._shadowRoot.getElementById("nome_completo").value,
            telefone: this._shadowRoot.getElementById("telefone").value,
            lead: LLead
        }
        this.postAxios(URL_END_POINT_SAVE_LEAD, LBody, (retornoLead) => {
            console.log("L S");
        })

    }

    getErrorField(field) {
        const errorF = errors.find(x => x.field == field);
        if (errorF != undefined) return errorF.mensagem;
    }

    maskCPF() {
        const cpf = this._shadowRoot.getElementById("cpf");
        cpf.value = cpf.value.replace(
            /(\d{3})(\d{3})(\d{3})(\d{2})/,
            "$1.$2.$3-$4"
        );
    }
    maskCPFTitular() {
        const cpf_titular = this._shadowRoot.getElementById("cpf_titular");
        cpf_titular.value = cpf_titular.value.replace(
            /(\d{3})(\d{3})(\d{3})(\d{2})/,
            "$1.$2.$3-$4"
        );
    }
    maskTelefone() {
        const telefone = this._shadowRoot.getElementById("telefone");
        telefone.value = telefone.value.replace(
            /(\d{2})(\d{5})(\d{4})/,
            "($1) $2-$3"
        );
    }
    maskCardNumber() {
        const card_number = this._shadowRoot.getElementById("card_number");
        if (payment_id == "amex") {
            card_number.value = card_number.value.replace(
                /(\d{4})(\d{4})(\d{4})(\d{3})/,
                "$1 $2 $3 $4"
            );
        } else {
            card_number.value = card_number.value.replace(
                /(\d{4})(\d{4})(\d{4})(\d{4})/,
                "$1 $2 $3 $4"
            );
        }
    }

    toAsterisk(str) {
        var LSTR2 = "";
        if (str.indexOf(" ") > -1) {
            var LSpace = str.split(" ");
            LSpace.forEach((objS, i) => {
                var LStr = objS.split("");
                LStr.forEach((obj, i) => {
                    if (i == 0) LSTR2 = LSTR2 + obj.toString().toUpperCase();
                    if (i > 0) LSTR2 = LSTR2 + '*';
                });
                LSTR2 = LSTR2 + " ";
            });
        } else {
            var LStr = str.split("");
            LStr.forEach((obj, i) => {
                if (i == 0) LSTR2 = LSTR2 + obj.toString().toUpperCase();
                if (i > 0) LSTR2 = LSTR2 + '*';
            });
        }
        return LSTR2;
    }
    setStarValue(value) {
        rating = value;
        console.log(value);
    }

    CREATE_FORM_MP(pdescription, pamount, pcardNumber, pcardholderName, pcardExpirationMonth, pcardExpirationYear, psecurityCode, parcela, pdocNumber, pemail, ppayment_method_id) {
        return new Promise(async (resolve, reject) => {
            if (document.contains(this._shadowRoot.getElementById("pay"))) { this._shadowRoot.getElementById("pay").remove(); }
            var f = document.createElement("form");
            f.setAttribute('method', "post");
            f.setAttribute('action', "/processar_pagamento");
            f.setAttribute('id', 'pay');
            f.setAttribute('name', 'pay');
            var fieldSet = document.createElement("FIELDSET");

            var description = document.createElement("input");
            description.setAttribute('type', "text");
            description.setAttribute('name', "description");
            description.setAttribute('id', "description");
            description.setAttribute('data-checkout', "description");
            description.setAttribute('value', pdescription);
            fieldSet.appendChild(description);

            var transaction_amount = document.createElement("input");
            transaction_amount.setAttribute('type', "text");
            transaction_amount.setAttribute('name', "transaction_amount");
            transaction_amount.setAttribute('id', "transaction_amount");
            transaction_amount.setAttribute('data-checkout', "transaction_amount");
            transaction_amount.setAttribute('value', pamount);
            fieldSet.appendChild(transaction_amount);

            var cardNumber = document.createElement("input");
            cardNumber.setAttribute('type', "text");
            cardNumber.setAttribute('name', "cardNumber");
            cardNumber.setAttribute('id', "cardNumber");
            cardNumber.setAttribute('data-checkout', "cardNumber");
            cardNumber.setAttribute('value', pcardNumber);
            fieldSet.appendChild(cardNumber);

            var cardholderName = document.createElement("input");
            cardholderName.setAttribute('type', "text");
            cardholderName.setAttribute('name', "cardholderName");
            cardholderName.setAttribute('id', "cardholderName");
            cardholderName.setAttribute('data-checkout', "cardholderName");
            cardholderName.setAttribute('value', pcardholderName);
            fieldSet.appendChild(cardholderName);

            var cardExpirationMonth = document.createElement("input");
            cardExpirationMonth.setAttribute('type', "text");
            cardExpirationMonth.setAttribute('name', "cardExpirationMonth");
            cardExpirationMonth.setAttribute('id', "cardExpirationMonth");
            cardExpirationMonth.setAttribute('data-checkout', "cardExpirationMonth");
            cardExpirationMonth.setAttribute('value', pcardExpirationMonth);
            fieldSet.appendChild(cardExpirationMonth);

            var cardExpirationYear = document.createElement("input");
            cardExpirationYear.setAttribute('type', "text");
            cardExpirationYear.setAttribute('name', "cardExpirationYear");
            cardExpirationYear.setAttribute('id', "cardExpirationYear");
            cardExpirationYear.setAttribute('data-checkout', "cardExpirationYear");
            cardExpirationYear.setAttribute('value', pcardExpirationYear);
            fieldSet.appendChild(cardExpirationYear);

            var securityCode = document.createElement("input");
            securityCode.setAttribute('type', "text");
            securityCode.setAttribute('name', "securityCode");
            securityCode.setAttribute('id', "securityCode");
            securityCode.setAttribute('data-checkout', "securityCode");
            securityCode.setAttribute('value', psecurityCode);
            fieldSet.appendChild(securityCode);

            var installments = document.createElement("select");
            installments.name = "installments";
            installments.id = "installments";
            var option = document.createElement("option");
            option.setAttribute('value', parcela);
            option.setAttribute('selected', 'selected');
            installments.appendChild(option);
            fieldSet.appendChild(installments);

            var docType = document.createElement("select");
            docType.name = "docType";
            docType.id = "docType";
            docType.setAttribute('data-checkout', 'docType');
            var optionD = document.createElement("option");
            optionD.setAttribute('value', "CPF");
            optionD.setAttribute('selected', 'selected');
            docType.appendChild(optionD);
            fieldSet.appendChild(docType);

            var docNumber = document.createElement("input");
            docNumber.setAttribute('type', "text");
            docNumber.setAttribute('name', "docNumber");
            docNumber.setAttribute('id', "docNumber");
            docNumber.setAttribute('data-checkout', "docNumber");
            docNumber.setAttribute('value', pdocNumber);
            fieldSet.appendChild(docNumber);

            var email = document.createElement("input");
            email.setAttribute('type', "text");
            email.setAttribute('name', "email");
            email.setAttribute('id', "email");
            email.setAttribute('data-checkout', 'email');
            email.setAttribute('value', pemail);
            fieldSet.appendChild(email);

            var payment_method_id = document.createElement("input");
            payment_method_id.setAttribute('type', "hidden");
            payment_method_id.setAttribute('name', "email");
            payment_method_id.setAttribute('id', "email");
            payment_method_id.setAttribute('data-checkout', 'payment_method_id');
            payment_method_id.setAttribute('value', ppayment_method_id);
            fieldSet.appendChild(payment_method_id);
            f.appendChild(fieldSet);
            resolve(f);
        });
    }

    collapse(id, idComando) {
        const element = this._shadowRoot.querySelector(id);
        const elementComando = this._shadowRoot.querySelector(idComando);
        if (element.classList.contains("show")) {
            element.classList.remove("show");
            elementComando.classList.remove("fa-arrow-up");
            elementComando.classList.add("fa-arrow-down");
        } else {
            element.classList.add("show");
            elementComando.classList.remove("fa-arrow-down");
            elementComando.classList.add("fa-arrow-up");
        }
    }

    toggleSelect(componente) {
        const ID = componente.id;
        var Selected = componente.options[componente.selectedIndex].value;
        if (Selected == 0) {
            VarianteIDUpSellSelected = 0;
            return;
        }
        const LImageID = produtoVariantes.find(x => x.id == Selected).image;
        var variant_img = LImageID; //images.find(x => x.id == LImageID).src;
        produtoVariantes.find(x => x.id == Selected).selected = Selected;
        const LSKU = produtoVariantes.find(x => x.id == Selected).sku;
        produtoVariantes.find(x => x.id == Selected).SkuSelected = LSKU;
        var variant_title = produtoVariantes.find(x => x.id == Selected).title;
        const LPrice = produtoVariantes.find(x => x.id == Selected).price;
        //const LVarianteIDSelected = this.LVariantes.find(x = x.id ==)
        VarianteIDUpSellSelected = Selected;
        VarianteImageUpSellSelected = variant_img;
        VarianteSKUUpSellSelected = LSKU;
        VariantePriceUpSellSelected = parseFloat(LPrice);
        VarianteTitleUPSellSelected = variant_title;
    }
    async adicionarProdutoUpSell() {
        if (VarianteTitleUPSellSelected == "" && VarianteIDUpSellSelected == "") return;
        this.ShowLoading();
        var lpro = await this.pushProducts(
            VarianteIDProdutoJSONUpSellSelected,
            quantity,
            VarianteIDUpSellSelected
        );
        /*ADICIONADO O TRECHO ABAIXO PARA GERENCIAR A QUANTIDADE NO CART, AO INVÉS DE FICAR AIDICONANDO VÁRIOS ITEMS */
        /* SE FICAR DANDO PROBLEMA COMENTE E O CÓDIGO ATÉ ONDE TEM 'ATÉ AQUI PARA GERENCIAR'  E DESCOMENTE A LINHA BAIXO*/
        //this.produtosCart.push(lpro);
        var LExists = produtosCart.find(
            x => x.variant_id == VarianteIDUpSellSelected
        );
        if (LExists == undefined) {
            produtosCart.push(lpro);
        } else {
            var LQuantidade = produtosCart.find(
                x => x.variant_id == VarianteIDUpSellSelected
            ).quantity;
            LQuantidade = LQuantidade + lpro.quantity;
            produtosCart.find(
                x => x.variant_id == VarianteIDUpSellSelected
            ).quantity = LQuantidade;
        }
        /*'ATÉ AQUI PARA GERENCIAR' */

        sessionStorage.setItem("cart", JSON.stringify(produtosCart));
        const LDivItens = this._shadowRoot.getElementById("items");
        LDivItens.innerHTML = "";
        const LDivQuantidade = this._shadowRoot.getElementById("totalQuantity");
        const Qtd = produtosCart.length;
        var LIt = " Item"
        if (Qtd > 1) {
            LIt = " Itens";
        }
        LDivQuantidade.innerHTML = Qtd + LIt;
        produtosCart.forEach((obj, i) => {
            LTotal += (parseFloat(obj.variant_price) * parseFloat(obj.quantity));
            const LTemplate = TEMPLATE_ITENS_CART.replace("{img}", obj.variant_img).replace("{title}", obj.title).replace("{variant_title}", obj.variant_title).replace("{quantity}", obj.quantity).replace("{variant_price}", this.formatPrice(obj.variant_price)).replace("{id_cart}", "cartTrash"+i);
            LDivItens.insertAdjacentHTML('beforeend', LTemplate);
            var LId = "cartTrash"+i;
            const LTrash = this._shadowRoot.getElementById(LId);
            var self = this;
            LTrash.addEventListener('click', ()=>{
                self.removeItemFromCart(LId, obj);
            })
            this.getTotal();
        });
        const granTot = this._shadowRoot.getElementById("granTotal");
        const granTot2 = this._shadowRoot.getElementById("granTotal2");
        const val = "R$ ";
        const valr = "Valor R$ ";
        granTot.innerHTML = "";
        granTot2.innerHTML = "";
        granTot.innerHTML = val.concat(this.formatPrice(granTotal));
        granTot2.innerHTML = valr.concat(this.formatPrice(granTotal));

        if (produtosCart.length > 0) {
            const formDataP = this._shadowRoot.getElementById("formDadosPessoais");
            const formDataE = this._shadowRoot.getElementById("formDadosEndereco");
            const formDataPa = this._shadowRoot.getElementById("formDadosPagamento");
            formDataP.classList.remove("hidden");
            formDataE.classList.remove("hidden");
            formDataPa.classList.remove("hidden");

        }
        this.HideLoading();
        //this.UpSellNoCheckout = 0;
    }


    removeItemFromCart(i, obj){
        this.ShowLoading();
        const LProd = JSON.parse(sessionStorage.getItem("cart"));
        const LItem = LProd.findIndex(x => x.id_thuor == obj.id_thuor);
        if(LItem > -1){
            LProd.splice(LItem, 1);
            sessionStorage.setItem("cart", JSON.stringify(LProd));
            this.reprocessaItensCart();
        }
    }

    reprocessaItensCart(){
        produtosCart = JSON.parse(sessionStorage.getItem("cart"));
        const LDivItens = this._shadowRoot.getElementById("items");
        LDivItens.innerHTML = "";
        const LDivQuantidade = this._shadowRoot.getElementById("totalQuantity");
        const Qtd = produtosCart.length;
        var LIt = " Item"
        if (Qtd > 1) {
            LIt = " Itens";
        }
        LDivQuantidade.innerHTML = Qtd + LIt;
        produtosCart.forEach((obj, i) => {
            LTotal += (parseFloat(obj.variant_price) * parseFloat(obj.quantity));
            const LTemplate = TEMPLATE_ITENS_CART
            .replace("{img}", obj.variant_img)
            .replace("{title}", obj.title)
            .replace("{variant_title}", obj.variant_title)
            .replace("{quantity}", obj.quantity)
            .replace("{variant_price}", this.formatPrice(obj.variant_price))
            .replace("{id_cart}", "cartTrash"+i);
            LDivItens.insertAdjacentHTML('beforeend', LTemplate);
            var LId = "cartTrash"+i;
            const LTrash = this._shadowRoot.getElementById(LId);
            var self = this;
            LTrash.addEventListener('click', ()=>{
                self.removeItemFromCart(LId, )
            })
            this.getTotal();
        });
        const granTot = this._shadowRoot.getElementById("granTotal");
        const granTot2 = this._shadowRoot.getElementById("granTotal2");
        const val = "R$ ";
        const valr = "Valor R$ ";
        granTot.innerHTML = "";
        granTot2.innerHTML = "";
        granTot.innerHTML = val.concat(this.formatPrice(granTotal));
        granTot2.innerHTML = valr.concat(this.formatPrice(granTotal));

        if (produtosCart.length > 0) {
            const formContinua = this._shadowRoot.getElementById("formContinua");          
            formContinua.classList.remove("hidden");
        }
        this.HideLoading();
    }

    async pushProducts(product, quantity, variante_id) {
        return new Promise(async (resolve, reject) => {
            try {
                this.postAxios(URL_END_POINT_GET_PRODUCT_IMPORTED, {
                    id_produto: product,
                    quantity: quantity,
                    variant: variante_id
                }, (response) => {
                    //getDadosLoja(retorno.data.id_usuario);
                    resolve(response.data);
                })
            } catch (error) {
                console.log("Erro ao pegar os dados do produto na API", error);
            }
        });
    }
    formatPrice(value) {
        let val = (value / 1).toFixed(2).replace(".", ",");
        return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }
    setDadosEndereco(dadosEndereco) {
        if (dadosEndereco != "") {
            endereco = this._shadowRoot.getElementById("endereco");
            bairro = this._shadowRoot.getElementById("bairro");
            cidade = this._shadowRoot.getElementById("cidadeestado");
            complemento = this._shadowRoot.getElementById("complemento");
            destinatario = this._shadowRoot.getElementById("destinatario");
            endereco.value = dadosEndereco.logradouro;
            bairro.value = dadosEndereco.bairro;
            cidade.innerHTML = dadosEndereco.localidade + " - " + dadosEndereco.uf;
            complemento.value = dadosEndereco.complemento;
            destinatario.value = this._shadowRoot.getElementById("nome_completo").value;
            cidadeEnd = dadosEndereco.localidade;
            estadoEnd = dadosEndereco.uf
        }
        else {
            endereco.value = "";
            bairro.value = "";
            cidade.value = "";
            estado.value = "";
            complemento.value = "";
            destinatario.value = "";
        }

        this.HideLoading();
    }
    consultaCEP() {
        CEP = this._shadowRoot.getElementById("cep");
        if (CEP.value.length >= 8) {
            CEP.value = CEP.value.replace(/(\d{5})(\d{3})/, "$1-$2");
            this.ShowLoading();
            this.postAxios(URL_END_PONT_GET_CEP, { cep: CEP.value }, (retornoCEP => {
                var retornoCEP = retornoCEP.data;
                this.setDadosEndereco(retornoCEP);

            }));
        } else {
            this.setDadosEndereco('');
        }
    }

    GetFretes() {
        this.ShowLoading();
        const LDivFretes = this._shadowRoot.getElementById("cardFretes");
        LDivFretes.innerHTML = '';
        this.postAxios(URL_END_POINT_GET_FRETE, { shop: dadosLoja.url_loja }, (response) => {
            const responseFrete = response.data;
            fretes = responseFrete;
            if (responseFrete.length > 0) {
                responseFrete.forEach((obj, i) => {
                    const LTempFrete = TEMPLATE_ITENS_FRETE.replace(/{id_frete}/g, "btn" + obj.id).replace(/{nome_frete}/g, obj.nome).replace("{{preco_frete}}", obj.preco);
                    LDivFretes.insertAdjacentHTML("beforeend", LTempFrete);
                    const LBtn = this._shadowRoot.getElementById("btn" + obj.id);
                    if (LBtn) {
                        LBtn.addEventListener("click", () => {
                            this.freteSelected(obj.id)
                        })
                    }
                    setTimeout(() => {
                        this.selecionaPadrao(obj.id, obj.preco, obj.nome);
                    }, 500);


                })
                this.HideLoading();
            }
        })

    }
    selecionaPadrao(id, preco, nome) {
        if (
            preco == "0,00" ||
            nome
                .toUpperCase()
                .includes("GRÁTIS" || nome.toUpperCase().includes("GRATIS"))
        ) {
            this.freteSelected(id);
        }
        return true;
    }

    InsertScriptGoogle(pixels) {
        return new Promise(async (resolve, reject) => {
            const dadosPixel = pixels;
            dadosPixel.forEach(async (obj, i) => {
                if (obj.tipo == 2) {
                    //console.log("Tipo 2");
                    var LInsertScript = await this.InsertScriptById(obj.google_analytics_id);
                    var LInsertTagScript = await this.InsertTagScript(obj.google_analytics_id, obj.google_analytics_id);
                }
            });
            resolve(1);
        });
    }

    async TriggerGoogleEvent(event, boleto) {
        var LTagEvent = "AW-{ID}/{ROTULO}";
        const dadosPixel = pixels;
        dadosPixel.forEach((obj, i) => {
            if (obj.tipo == 2) {
                var LProdutos = [];
                if (obj.google_id_conversao != undefined && obj.google_id_conversao.length > 0) {
                    if (obj.array_produtos_id != null && obj.array_produtos_id.length > 3) {
                        LProdutos = JSON.parse(obj.array_produtos_id);
                        if (LProdutos.length > 0) {
                            const LProdutosCart = JSON.parse(sessionStorage.getItem("cart"));
                            LProdutos.forEach((obj, i) => {
                                const LProdutoFinded = LProdutosCart.find(x => x.id_thuor == obj.id_thuor);
                                if (LProdutoFinded != undefined) {
                                    if (obj.marca_boleto && boleto != undefined) {
                                        //gtag('event', event);
                                        gtag('event', event, {
                                            'send_to': LTagEvent.replace('{ID}', obj.google_id_conversao).replace('{ROTULO}', obj.google_rotulo_conversao)
                                        });
                                        //console.log("Event 1");
                                    }
                                    else if (boleto == undefined) {
                                        //gtag('event', event);
                                        gtag('event', event, {
                                            'send': LTagEvent.replace('{ID}', obj.google_id_conversao).replace('{ROTULO}', obj.google_rotulo_conversao)
                                        });
                                        //console.log("Event 2");
                                    }
                                }
                            })
                        }
                    }
                    else if (boleto !== undefined && obj.marca_boleto == 1) {
                        //gtag('event', event);
                        gtag('event', event, {
                            'send_to': LTagEvent.replace('{ID}', obj.google_id_conversao).replace('{ROTULO}', obj.google_rotulo_conversao)
                        });
                        //console.log("Event 3", event);
                    }
                    else if (boleto == undefined) {
                        //gtag('event', event);
                        gtag('event', event, {
                            'send_to': LTagEvent.replace('{ID}', obj.google_id_conversao).replace('{ROTULO}', obj.google_rotulo_conversao)
                        });
                        //console.log("Event 4", event);
                    }
                }
            }
        })


    }
    InsertScriptById(id) {
        return new Promise(async (resolve, reject) => {
            const pluginGG = document.createElement("script");
            pluginGG.onload = function () {
                resolve(true);
            };
            pluginGG.setAttribute(
                "src",
                "https://www.googletagmanager.com/gtag/js?id=UA-" + id
            );
            pluginGG.async = true;
            document.head.appendChild(pluginGG);
        });
    }
    InsertTagScript(id, id_aly) {
        return new Promise(async (resolve, reject) => {
            const pluginGG2 = document.createElement("script");
            var inlineScript = document.createTextNode("window.dataLayer = window.dataLayer || []; function gtag(){dataLayer.push(arguments);} gtag('js', new Date()); gtag('config', 'UA-" + id + "', {'send_page_view': false, 'optimize_id': 'GTM-" + id + "'}); gtag('config', 'GA-" + id + "', {'optimize_id': 'GTM-" + id + "'}); gtag('config', 'AW-" + id_aly + "');");
            pluginGG2.appendChild(inlineScript);
            document.head.appendChild(pluginGG2);
            resolve(1);
        });
    }

    InsertScriptFace(pixels) {
        return new Promise(async (resolve, reject) => {
            const pluginFB = document.createElement("script");
            var inlineScript = document.createTextNode("!function (f, b, e, v, n, t, s) { if (f.fbq) return; n = f.fbq = function () { n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments) }; if (!f._fbq) f._fbq = n; n.push = n; n.loaded = !0; n.version = '2.0'; n.queue = []; t = b.createElement(e); t.async = !0; t.src = v; s = b.getElementsByTagName(e)[0]; s.parentNode.insertBefore(t, s) }(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js')");
            pluginFB.appendChild(inlineScript);
            document.head.appendChild(pluginFB);
            const dadosPixel = pixels;
            dadosPixel.forEach((obj, i) => {
                if (obj.tipo == 1) {
                    fbq('init', obj.facebook_id_pixel);
                }
            });
            resolve(1);
        });
    }

    async TriggerFacebookEvent(event, boleto) {
        const dadosPixel = pixels;
        dadosPixel.forEach((obj, i) => {
            if (obj.tipo == 1) {
                var LProdutos = [];
                if (obj.facebook_id_pixel != undefined && obj.facebook_id_pixel.length > 0) {
                    if (obj.array_produtos_id != null && obj.array_produtos_id.length > 3) {
                        LProdutos = JSON.parse(obj.array_produtos_id);
                        if (LProdutos.length > 0) {
                            const LProdutosCart = JSON.parse(sessionStorage.getItem("cart"));
                            LProdutos.forEach((obj, i) => {
                                const LProdutoFinded = LProdutosCart.find(x => x.id_thuor == obj.id_thuor);
                                if (LProdutoFinded != undefined) {
                                    if (obj.marca_boleto && boleto != undefined) {
                                        fbq('track', event);
                                    }
                                    else if (boleto == undefined) {
                                        fbq('track', event);
                                    }
                                }
                            })
                        }
                    }
                    else if (boleto !== undefined && obj.marca_boleto == 1) {
                        fbq('track', event);
                    }
                    else if (boleto == undefined) {
                        fbq('track', event);
                    }
                }
            }
        });

    }

    freteSelected(id) {
        freteSelecionado = id;
        var lnome = fretes.find(x => x.id == freteSelecionado).nome;
        valorFrete = parseFloat(
            fretes.find(x => x.id == freteSelecionado).preco
        );
        console.log(valorFrete);
        fretes.forEach((obj, i) => {
            const LD = this._shadowRoot.getElementById("btn" + obj.id);
            if (LD) {
                LD.classList.remove('classSelected');
                LD.classList.remove('opcaoSelecionada');
                LD.classList.add('opcaoDeselecionada');
            }
        });
        const LSelected = this._shadowRoot.getElementById("btn" + id);
        if (LSelected) {
            LSelected.classList.remove('opcaoDeselecionada');
            LSelected.classList.add('opcaoSelecionada');
        }
        this.getTotal();
    }

    async getTotal() {
        this.ShowLoading();
        this.totalQuantity = 0;
        this.descontoCupom = 0;
        var subTotal = 0,
            total = 0,
            discount = 0;
        var LTotal = {
            subTotal: 0,
            total: 0,
            discount: 0
        };
        if (sessionStorage.getItem("cart") != null) {
            produtosCart = JSON.parse(sessionStorage.getItem("cart"));
        }
        if (sessionStorage.getItem("vld") != null) {
            descontoCupom = parseFloat(sessionStorage.getItem("vld"));
        }
        if (produtosCart != null) {
            produtosCart.forEach((item, i) => {
                subTotal =
                    parseFloat(subTotal) +
                    parseFloat(item.variant_price_ancora) * parseInt(item.quantity);
                total =
                    parseFloat(total) +
                    parseFloat(item.variant_price) * parseFloat(item.quantity);
                totalQuantity =
                    parseInt(totalQuantity) + parseInt(item.quantity);
                if (parseFloat(subTotal) > parseFloat(total)) {
                    discount = parseFloat(subTotal) - parseFloat(total);
                }
                if (parseFloat(total) > parseFloat(subTotal)) {
                    discount = parseFloat(total) - parseFloat(subTotal);
                }
            });
            total = parseFloat(total) - parseFloat(descontoCupom);
            total = parseFloat(total) + parseFloat(valorFrete);

            granSubTotal = subTotal;
            granDesconto = discount;
            granTotal = total;
            LTotal = {
                subTotal: subTotal,
                total: total,
                discount: discount
            };
            const granTot = this._shadowRoot.getElementById("granTotal");
            const granTot2 = this._shadowRoot.getElementById("granTotal2");
            const val = "R$ ";
            const valr = "Valor R$ ";
            granTot.innerHTML = val.concat(this.formatPrice(granTotal));
            granTot2.innerHTML = valr.concat(this.formatPrice(granTotal));
            this.HideLoading();
            return LTotal;
        }
    }

    formaPagamentoSelecionada(fmp) {
        formaPagamento = fmp;
        payment_id = fmp;
        const PaymentFormCC = this._shadowRoot.getElementById("creditCard");
        const PaymentFormBB = this._shadowRoot.getElementById("bolbradesco");
        const FormPaymentCC = this._shadowRoot.getElementById("creditCardForm");
        const FormPaymentBB = this._shadowRoot.getElementById("bolbradescoForm");
        PaymentFormCC.classList.remove("opcaoSelecionada");
        PaymentFormBB.classList.remove("opcaoSelecionada");
        PaymentFormCC.classList.add("opcaoDeSelecionada");
        PaymentFormBB.classList.add("opcaoDeSelecionada");
        FormPaymentCC.classList.add("hidden");
        FormPaymentBB.classList.add("hidden");

        const LForm = fmp + "Form";
        const Selected = this._shadowRoot.getElementById(LForm);
        if (Selected) {
            Selected.classList.remove("hidden");
            Selected.classList.add("opcaoSelecionada");
        }
        const SelectedButton = this._shadowRoot.getElementById(fmp);
        if (SelectedButton) {
            //SelectedButton.classList.remove("opcaoDeselecionada");
            SelectedButton.classList.add("opcaoSelecionada");
        }
        const LValorText = this._shadowRoot.getElementById("valorTotalBoleto");
        LValorText.innerHTML = this.formatPrice(granTotal);
        this.TriggerFacebookEvent("AddPaymentInfo");
        this.TriggerGoogleEvent("add_payment_info");
    }
    removeAcento(text) {
        text = text.toLowerCase();
        text = text.replace(new RegExp("[ÁÀÂÃ]", "gi"), "a");
        text = text.replace(new RegExp("[ÉÈÊ]", "gi"), "e");
        text = text.replace(new RegExp("[ÍÌÎ]", "gi"), "i");
        text = text.replace(new RegExp("[ÓÒÔÕ]", "gi"), "o");
        text = text.replace(new RegExp("[ÚÙÛ]", "gi"), "u");
        text = text.replace(new RegExp("[Ç]", "gi"), "c");
        return text;
    }

    getFreteSelecionadoNome() {
        var lnome = "";
        if (fretes.length > 0) {
            const LF = fretes.find(x => x.id == freteSelecionado);
            if (LF) {
                lnome = LF.nome;
            }
        }
        //console.log("Nome Selecionado", lnome);
        return lnome;
    }

    getRandomStringEmail() {
        let r = Math.random().toString(36).substring(11);
        return r;
    }

    getDadosPagamentoTransacao() {
        return new Promise((resolve, reject) => {
            try {
                var transacao = {
                    dadosComprador: {
                        nome_completo: this.removeAcento(this._shadowRoot.getElementById("nome_completo").value),
                        email: this._shadowRoot.getElementById("email").value,
                        cpf: this._shadowRoot.getElementById("cpf").value,
                        telefone: this._shadowRoot.getElementById("telefone").value,
                        cep: this._shadowRoot.getElementById("cep").value,
                        endereco: this.removeAcento(this._shadowRoot.getElementById("endereco").value),
                        numero_porta: this._shadowRoot.getElementById("numero_porta").value,
                        bairro: this._shadowRoot.getElementById("bairro").value,
                        cidade: cidadeEnd,
                        estado: estadoEnd,
                        complemento: this.removeAcento(this._shadowRoot.getElementById("complemento").value),
                        destinatario: this.removeAcento(this._shadowRoot.getElementById("destinatario").value),
                        numero_cartao: this._shadowRoot.getElementById("card_number").value,
                        validade: this._shadowRoot.getElementById("validade").value,
                        nome_titular: this._shadowRoot.getElementById("nome_titular").value,
                        codigo_seguranca: this._shadowRoot.getElementById("codigo_seguranca").value,
                        cpf_titular: this._shadowRoot.getElementById("cpf_titular").value,
                        frete: this.getFreteSelecionadoNome(),
                        valor: this.formatPrice(granTotal),
                        forma: formaPagamento,
                        barcode: "",
                        urlBoleto: "",
                        parcela: parcelas,
                        valorParcela: "",
                        bandeira: payment_id
                    },
                    produtos: produtosCart,
                    dadosLoja: dadosLoja,
                    dadosCheckout: DadosCheckout,
                    paymentData: {
                        transaction_amount: this.formatPrice(granTotal),
                        token: cardToken,
                        description: dadosLoja.nome_loja,
                        installments: parcelas,
                        payment_method_id: payment_id,
                        payer: {
                            email: this.getRandomStringEmail() + this._shadowRoot.getElementById("email").value
                        }
                    }
                };
                const JSONString = JSON.stringify(transacao);
                //console.log(JSONString);
                const LCripto = btoa(JSONString);

                resolve(LCripto);
            }
            catch (error) {
                reject(error);
            }
        })

    }

    async iniciaPagamentoBackEndBoleto() {
        this.ShowLoading();
        window.Mercadopago.clearSession();
        const LCripto = await this.getDadosPagamentoTransacao();
        sessionStorage.setItem("cr", LCripto);
        this.postAxios(URL_END_POINT_PAY_TICKET, { pay: LCripto }, (retornoPay) => {
            if (
                retornoPay.data.status != undefined &&
                (retornoPay.data.status.toUpperCase() == "REJECTED" ||
                    retornoPay.data.status.toUpperCase() == "CANCELED" ||
                    retornoPay.data.status.toUpperCase() == "VACATED")
            ) {
                this.showNotificationW(
                    "Oops!",
                    "Pagamento Rejeitado. Por favor, tente novamente.",
                    "error"
                );
                return;
            }
            var DadosCliente = {
                nome: nome_completo,
                dadosCompra: retornoPay.data
            };
            window.Mercadopago.clearSession();
            this.showNotificationW("Pagamento Realizado!", "Em instantes você irá receber um e-mail com os detalhes da sua compra.", "success");
        })
    }

    async iniciaPagamentoBackEndCard() {
        this.ShowLoading();
        var eParcel = this._shadowRoot.getElementById("dropParcelas");
        var eParcelSelected = eParcel.options[eParcel.selectedIndex].value;
        const LForm = await this.CREATE_FORM_MP(
            dadosLoja.nome_loja,
            parseFloat(granTotal),
            this._shadowRoot.getElementById("card_number").value.replace(/ /g, ''),
            this._shadowRoot.getElementById("nome_titular").value,
            this._shadowRoot.getElementById("validade").value.split('/')[0],
            this._shadowRoot.getElementById("validade").value.split('/')[1],
            this._shadowRoot.getElementById("codigo_seguranca").value,
            eParcelSelected,
            this._shadowRoot.getElementById("cpf_titular").value,
            this._shadowRoot.getElementById("email").value,
            payment_id)
        var self = this;
        window.Mercadopago.createToken(LForm, async (status, response) => {

            if (status != 200 && status != 201) {
                //console.log("Não foi possível gerar o token", response.message);
                window.Mercadopago.clearSession();
                self.showNotificationW(
                    "Oops!",
                    "Não foi possível completar a ação. Tente novamente!",
                    "warning"
                );
            } else {
                self.ShowLoading();
                cardToken = response.id;
                const LCripto = await self.getDadosPagamentoTransacao();

                self.postAxios(URL_END_POINT_PAY_CARD, { pay: LCripto }, async (retornoPay) => {
                    if (
                        retornoPay.data.status != undefined &&
                        (retornoPay.data.status.toUpperCase() == "REJECTED" ||
                            retornoPay.data.status.toUpperCase() == "CANCELED" ||
                            retornoPay.data.status.toUpperCase() == "VACATED")
                    ) {
                        const LMensagem = await self.getErrorMPDetail(retornoPay.data.status_detail);
                        self.showNotificationW(
                            "Oops!",
                            "Pagamento Rejeitado. " + LMensagem,
                            "error"
                        );
                        return;
                    }
                    var DadosCliente = {
                        nome: self._shadowRoot.getElementById("nome_completo").value,
                        dadosCompra: retornoPay.data
                    };

                    window.Mercadopago.clearSession();
                    self.showNotificationW("Pagamento Realizado!", "Em instantes você irá receber um e-mail com os detalhes da sua compra.", "success");
                })

                //break;
            }
        });
    }
    getParcelas() {
        var self = this;
        window.Mercadopago.getInstallments(
            {
                payment_method_id: payment_id,
                amount: granTotal
            },
            function (status, response) {
                if (status == 200) {
                    self._shadowRoot.getElementById("dropParcelas").options.length = 0;
                    response[0].payer_costs.forEach(installment => {
                        let opt = document.createElement("option");
                        opt.text = installment.recommended_message;
                        opt.value = installment.installments;
                        opt.id = "parcel_" + installment.installments;
                        self._shadowRoot.getElementById("dropParcelas").appendChild(opt);
                        setTimeout(() => {
                            self._shadowRoot.getElementById("dropParcelas").selectedIndex = 0;
                            self._shadowRoot.getElementById("dropParcelas").value = 1;
                            self.parcelas = 1;
                        }, 1000);
                    });
                } else {
                    console.log(`installments method info error: ${response}`);
                }
            }
        );
    }
    setParcelas() {
        setTimeout(() => {
            this._shadowRoot.getElementById("dropParcelas").selectedIndex = 0;
            this._shadowRoot.getElementById("dropParcelas").value = 1;
            parcelas = 1;
        }, 1000);
    }
    maskValidade() {
        const validade = this._shadowRoot.getElementById("validade");
        validade.value = validade.value.replace(/(\d{2})(\d{2})/, "$1/$2");
    }
    verificaDigitosCartao() {
        const card_number = this._shadowRoot.getElementById("card_number");
        const binCard = card_number.value.replace(/ /g, "");
        if (binCard.length >= 6) {
            let bin = binCard.substring(0, 6);
            window.Mercadopago.getPaymentMethod(
                {
                    bin: bin
                },
                (status, response) => {
                    if (status == 200) {
                        payment_id = response[0].id;
                        if (this._shadowRoot.getElementById("dropParcelas").length < 2) {
                            this.getParcelas();
                        }
                        this.setParcelas();
                    } else {
                        this.showNotificationW('Oops!', 'Cartão de Crédito Não Reconhecido. Verifique!', 'error');
                    }
                }
            );
        }

        this.maskCardNumber();
    }
    async iniciaPagamentoBackEnd(status, response) {
        var self = this;
        if (status != 200 && status != 201) {
            //console.log("Não foi possível gerar o token", response.message);
            window.Mercadopago.clearSession();
            self.showNotificationW(
                "Oops!",
                "Não foi possível completar a ação. Tente novamente!",
                "warning"
            );
        } else {
            self.ShowLoading();
            cardToken = response.id;
            const LCripto = await self.getDadosPagamentoTransacao();

            self.postAxios(URL_END_POINT_PAY_CARD, { pay: LCripto }, async (retornoPay) => {
                if (
                    retornoPay.data.status != undefined &&
                    (retornoPay.data.status.toUpperCase() == "REJECTED" ||
                        retornoPay.data.status.toUpperCase() == "CANCELED" ||
                        retornoPay.data.status.toUpperCase() == "VACATED")
                ) {
                    const LMensagem = await self.getErrorMPDetail(retornoPay.data.status_detail);
                    self.showNotificationW(
                        "Oops!",
                        "Pagamento Rejeitado. " + LMensagem,
                        "error"
                    );
                    return;
                }
                var DadosCliente = {
                    nome: self._shadowRoot.getElementById("nome_completo").value,
                    dadosCompra: retornoPay.data
                };

                window.Mercadopago.clearSession();
                self.showNotificationW("Pagamento Realizado!", "Em instantes você irá receber um e-mail com os detalhes da sua compra.", "success");
            })

            //break;
        }
    }

    getErrorMPDetail(detail) {
        return new Promise((resolve, reject) => {
            try {
                if (detail == "cc_rejected_insufficient_amount") {
                    resolve('Saldo Insuficiente No Cartão de Crédito');
                }
                if (detail == "cc_rejected_bad_filled_card_number") {
                    resolve('Verifique o número do cartão.');
                }
                if (detail == "cc_rejected_bad_filled_date") {
                    resolve('Verifique a data de validade.');
                }
                if (detail == "cc_rejected_bad_filled_security_code") {
                    resolve('Código de segurança inválido.');
                }

            }
            catch (error) {
                reject(error);
            }
        })
    }

    /* FINALIZEI NOVAS AQUI */

    initializeFunction() {
        const buttonAdd = this._shadowRoot.getElementById("buttonAdd");
        buttonAdd.addEventListener("click", () => {
            this.adicionarProdutoUpSell();
        });
        const creditCClick = this._shadowRoot.getElementById("creditCard");
        creditCClick.addEventListener("click", () => {
            this.formaPagamentoSelecionada('creditCard');
        });

        const bolBraClick = this._shadowRoot.getElementById("bolbradesco");
        bolBraClick.addEventListener("click", () => {
            this.formaPagamentoSelecionada('bolbradesco');
        });
        const cmdCol = this._shadowRoot.getElementById("collapseR");
        cmdCol.addEventListener("click", () => {
            this.collapse('#collapseResumo', '#comandoCollapse');
        })
        const editaDadosPe = this._shadowRoot.getElementById("editaDadosPessoaisButton");
        editaDadosPe.addEventListener("click", () => {
            this.editarDadosPessoais();
        });
        const editaDadosEnd = this._shadowRoot.getElementById("editaDadosEnderecoButton");
        editaDadosEnd.addEventListener("click", () => {
            this.editarDadosEndereco();
        });
        const btnDadosP = this._shadowRoot.getElementById("btnDadosPe");
        btnDadosP.addEventListener("click", () => {
            this.validateMyForm();
        });

        const btnDadosEn = this._shadowRoot.getElementById("btnDadosEnd");
        btnDadosEn.addEventListener("click", () => {
            this.validateMyForm();
        });
        const btnBuyCar = this._shadowRoot.getElementById("btnBuyCard");
        btnBuyCar.addEventListener("click", () => {
            this.validateMyForm();
        });
        const btnBuyBolet = this._shadowRoot.getElementById("btnBuyBoleto");
        btnBuyBolet.addEventListener("click", () => {
            this.validateMyForm();
        });

        const ecpf = this._shadowRoot.getElementById("cpf");
        ecpf.addEventListener('change', () => {
            this.maskCPF();
        });
        ecpf.addEventListener('blur', () => {
            this.saveLead();
        });
        const ecep = this._shadowRoot.getElementById("cep");
        ecep.addEventListener("change", () => {
            this.consultaCEP();
        });
        const ecard_number = this._shadowRoot.getElementById("card_number");
        ecard_number.addEventListener("change", () => {
            this.verificaDigitosCartao();
        });
        const evalidade = this._shadowRoot.getElementById("validade");
        evalidade.addEventListener("change", () => {
            this.maskValidade();
        });
        const ecpfTitular = this._shadowRoot.getElementById("cpf_titular");
        ecpfTitular.addEventListener("change", () => {
            this.maskCPFTitular();
        });
        const eTelefone = this._shadowRoot.getElementById("telefone");
        eTelefone.addEventListener("change", () => {
            this.maskTelefone();
        });

        //this.ShowLoading();
        /* DADOS PESSOAIS */
        formValidateDadosPessoais.push({ nome: 'email', type: 'text', required: true, value: '' });
        formValidateDadosPessoais.push({ nome: 'nome_completo', type: 'text', required: true, value: '' });
        formValidateDadosPessoais.push({ nome: 'cpf', type: 'text', required: true, value: '' });
        formValidateDadosPessoais.push({ nome: 'telefone', type: 'text', required: true, value: '' });
        /* DADOS ENDEREÇO */
        formValidateDadosEndereco.push({ nome: 'cep', type: 'text', required: true, value: '' });
        formValidateDadosEndereco.push({ nome: 'endereco', type: 'text', required: true, value: '' });
        formValidateDadosEndereco.push({ nome: 'numero_porta', type: 'text', required: true, value: '' });
        formValidateDadosEndereco.push({ nome: 'complemento', type: 'text', required: true, value: '' });
        formValidateDadosEndereco.push({ nome: 'bairro', type: 'text', required: true, value: '' });


        formValidateDadosCartao.push({ nome: 'card_number', type: 'text', required: true, value: '' });
        formValidateDadosCartao.push({ nome: 'validade', type: 'text', required: true, value: '' });
        formValidateDadosCartao.push({ nome: 'nome_titular', type: 'text', required: true, value: '' });
        formValidateDadosCartao.push({ nome: 'codigo_seguranca', type: 'text', required: true, value: '' });
        formValidateDadosCartao.push({ nome: 'cpf_titular', type: 'text', required: true, value: '' });

        const LProduto = this.getAttribute("id_produto");

        var LBody = {
            id_produto: LProduto
        }
        this.postAxios(URL_END_POINT_GET_PRODUCT, LBody, (response) => {
            VarianteIDProdutoJSONUpSellSelected = LProduto;
            produtoToSell = response.data;
            const variantes = produtoToSell.json_dados_produto.variants;
            images = produtoToSell.json_dados_produto.images;
            const id_u = produtoToSell.id_usuario;
            this.getDadosLoja(id_u);
            this.getPixels(id_u);
            variantes.forEach((obj, i) => {

                const img = images.find(x => x.id == obj.image_id).src;
                const LP = { id: obj.id, title: obj.title, image: img, price: obj.price, sku: obj.sku };
                produtoVariantes.push(LP);

                if (produtoVariantes && produtoVariantes.length > 0) {
                    var select = document.createElement("select");
                    select.name = "Opcao";
                    select.classList.add("selectpicker");
                    select.id = "Opcao";
                    select.setAttribute(
                        "class",
                        "selectpicker form-control col-md-12 mt-2 "
                    );
                    var self = this;
                    select.onchange = function () {
                        self.toggleSelect(select);
                    };

                    const LProdOptions = this._shadowRoot.getElementById("productOptions");
                    LProdOptions.innerHTML = "";
                    LProdOptions.append(select);
                    var option = document.createElement("option");
                    option.value = 0;
                    option.text = "Selecione";
                    select.appendChild(option);
                    produtoVariantes.forEach((obj, i) => {
                        var option = document.createElement("option");
                        option.value = obj.id;
                        option.text = obj.title;
                        select.appendChild(option);
                    });

                }
            })

            this.HideLoading();
        });
    }

}
customElements.define('checkout-mp', CheckoutMP);