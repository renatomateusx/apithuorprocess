var pool = require('../db/queries');
var jwt = require('jsonwebtoken');
const constantes = require('../resources/constantes');
const utilis = require('../resources/util');
const utilisM = require('../routes/services/utilis');
const format = require('string-format');
const transacoes = require('./transacao');
const clientes = require('../schemas/clientes');
const funcionalidadesShpify = require('../resources/funcionalidadesShopify');

module.exports.GetCheckoutAtivo = (req, res, next) => {
    try {
        const { id_usuario } = req.body;
        var canSend = true;
        pool.query('SELECT * FROM checkouts where id_usuario = $1 and status = 1', [id_usuario], (error, results) => {
            if (error) {
                throw error
            }
            if (results.rowCount == 0) {
                res.status(200).send(null);
                res.end();
            } else {
                results.rows.forEach(async (ck, ii) => {
                    if (ck.gateway == 1 && ck.json_checkout) {
                        ck.json_checkout.forEach((objck, i) => {
                            if (objck.status == 1) {
                                results.rows[0].chave_publica = objck.chave_publica;
                                results.rows[0].token_acesso = objck.token_acesso;
                                canSend = false;
                                res.status(200).send(results.rows[0]);
                                res.end();
                            }
                        })
                        if (canSend) {
                            res.status(200).send(null);
                            res.end();
                        }

                    }
                    else {
                        res.status(200).send(results.rows[0]);
                        res.end();
                    }
                });
            }
        })
    } catch (error) {
        res.json(error);
        res.end();
    }
}

module.exports.GetCheckoutAtivoInternalOption = (id_usuario) => {
    return new Promise((resolve, reject) => {
        try {
            pool.query('SELECT * FROM checkouts where id_usuario = $1 and status = 1', [id_usuario], (error, results) => {
                if (error) {
                    throw error
                }
                results.rows.forEach(async (ck, ii) => {
                    if (ck.gateway == 1 && ck.json_checkout) {
                        ck.json_checkout.forEach((objck, i) => {
                            if (objck.status == 1) {
                                results.rows[0].chave_publica = objck.chave_publica;
                                results.rows[0].token_acesso = objck.token_acesso;
                                resolve(results.rows[0]);
                            }

                        })
                    }
                    else {
                        resolve(results.rows[0]);
                    }
                });

            })
        } catch (error) {
            reject(error);
        }
    })

}

module.exports.GetCheckoutByID = (req, res, next) => {
    try {
        const { id_usuario, gateway } = req.body;
        console.log(id_usuario, gateway);
        pool.query('SELECT * FROM checkouts where id_usuario = $1 and gateway=$2', [id_usuario, gateway], (error, results) => {
            if (error) {
                throw error
            }
            res.status(200).send(results.rows[0]);
            res.end();
        })
    } catch (error) {
        res.json(error);
        res.end();
    }
}

module.exports.GetCheckoutByIDInternal = (id_usuario, gateway) => {
    return new Promise((resolve, reject) => {
        try {
            pool.query('SELECT * FROM checkouts where id_usuario = $1 and gateway=$2', [id_usuario, gateway], (error, results) => {
                if (error) {
                    throw error
                }
                resolve(results.rows[0]);
            })
        } catch (error) {
            reject(error);
        }
    })

}

module.exports.GetCheckoutAtivoInternal = (req, res, next) => {
    return new Promise(async (resolve, reject) => {
        try {
            const { id_usuario } = req.body;
            pool.query('SELECT * FROM checkouts where id_usuario = $1 and status = 1', [id_usuario], (error, results) => {
                if (error) {
                    throw error
                }
                resolve(results.rows[0]);
            })
        } catch (error) {
            reject(error);
        }
    });
}

module.exports.GetCheckoutAtivoInternalAlt = (id_usuario) => {
    return new Promise(async (resolve, reject) => {
        try {
            pool.query('SELECT * FROM checkouts where id_usuario = $1 and status = 1', [id_usuario], (error, results) => {
                if (error) {
                    throw error
                }
                resolve(results.rows[0]);
            })
        } catch (error) {
            reject(error);
        }
    });
}


module.exports.CheckStatusBoleto = (idTransaction, LDadosCheckout) => {
    return new Promise(async (resolve, reject) => {
        try {
            const URL = constantes.API_MP.replace("{id}", idTransaction).replace("{token}", LDadosCheckout.token_acesso);
            const LConsultaPagamento = await utilis.makeAPICallExternal(URL);
            resolve(LConsultaPagamento);
        }
        catch (error) {
            console.log("Erro ao Verificar Status Boleto", error);
            reject(error);
        }
    });
}

module.exports.DoPay = (req, res, next) => {
    try {
        const { pay } = req.body;
        const LJSON = JSON.parse(Buffer.from(pay, 'base64').toString());

        ///console.log("Pay", LJSON);
        if (LJSON.dadosCheckout.gateway == 1) {
            const URL = constantes.API_MP_PAYMENT.replace('{token}', LJSON.dadosCheckout.token_acesso)
            var paymentData = {
                transaction_amount: parseFloat(LJSON.paymentData.transaction_amount),
                token: LJSON.paymentData.token,
                description: LJSON.paymentData.description,
                installments: parseInt(LJSON.paymentData.installments),
                payment_method_id: LJSON.paymentData.payment_method_id,
                payer: LJSON.paymentData.payer
            }
            console.log("paymentData", paymentData);
            utilis.makeAPICallExternalParamsJSON(URL, '', paymentData, undefined, undefined, 'POST')
                .then(async function (data) {
                    const DataResponse = JSON.parse(data.body);
                    ///console.log(DataResponse);
                    if (DataResponse.status == 'approved') {
                        LJSON.dadosComprador.data = DataResponse.date_created;
                        LJSON.dadosComprador.id_transacao = DataResponse.id;
                        LJSON.dadosComprador.valorParcela = DataResponse.transaction_details.installment_amount;
                        var responseShopify = await funcionalidadesShpify.enviaOrdemShopify(LJSON, DataResponse, paymentData, 'paid', constantes.GATEWAY_MP);
                        var plataformasResponse = {
                            shopify: responseShopify,
                            woo: 'notYet',
                        }
                        res.status(200).send(responseShopify);
                    }
                    else {
                        console.log("Response", DataResponse);
                        res.status(422).send("Pagamento não realizado, tente novamente");
                    }

                }).catch(function (error) {
                    console.log("Erro MP", error);
                    if (error.cause != undefined) {
                        console.log(error.cause[0].code);
                        res.status(422).send(error.cause[0].code);
                    }
                    else {
                        res.status(422).send("Pagamento não realizado, tente novamente");
                    }
                });
        }

    } catch (error) {
        res.json(error);
        res.end();
    }
}

module.exports.DoPayTicket = (req, res, next) => {
    try {
        const { pay } = req.body;
        const LJSON = JSON.parse(Buffer.from(pay, 'base64').toString());
        const URL = constantes.API_MP_PAYMENT.replace('{token}', LJSON.dadosCheckout.token_acesso)

        var FirstLastName = LJSON.dadosComprador.nome_completo.split(" ");
        // console.log(LJSON.dadosCheckout.token_acesso);
        var paymentData = {
            transaction_amount: parseFloat(LJSON.paymentData.transaction_amount),
            description: LJSON.paymentData.description,
            payment_method_id: LJSON.paymentData.payment_method_id,
            payer: {
                email: LJSON.paymentData.payer.email,
                first_name: FirstLastName[0],
                last_name: FirstLastName[FirstLastName.length - 1],
                identification: {
                    type: 'CPF',
                    number: LJSON.dadosComprador.cpf.replace(/[.-]/g, '')
                },
                address: {
                    zip_code: LJSON.dadosComprador.cep.replace(/-/g, ''),
                    street_name: LJSON.dadosComprador.endereco,
                    street_number: LJSON.dadosComprador.numero_porta,
                    neighborhood: LJSON.dadosComprador.bairro,
                    city: LJSON.dadosComprador.cidade,
                    federal_unit: LJSON.dadosComprador.estado
                }
            }
        }
        utilis.makeAPICallExternalParamsJSON(URL, '', paymentData, undefined, undefined, 'POST')
            .then(async function (data) {

                const DataResponse = JSON.parse(data.body);
                /*console.log(DataResponse);*/
                LJSON.dadosComprador.barcode = DataResponse.barcode.content;
                LJSON.dadosComprador.urlBoleto = DataResponse.transaction_details.external_resource_url;
                LJSON.dadosComprador.vencimentoBoleto = DataResponse.date_of_expiration;
                LJSON.dadosComprador.data = DataResponse.date_created;
                LJSON.dadosComprador.id_transacao = DataResponse.id;
                //console.log(LJSON.dadosComprador);
                if (DataResponse.status == 'pending') {
                    var responseShopify = await funcionalidadesShpify.enviaOrdemShopify(LJSON, DataResponse, paymentData, 'pending', constantes.GATEWAY_MP);
                    const LDadosComprador = responseShopify.dadosComprador.dadosComprador;
                    const LDadosLoja = responseShopify.dadosComprador.dadosLoja;
                    utilisM.SendEmailBoletoInternal(LDadosComprador, LDadosLoja);
                    // var plataformasResponse = {
                    //     shopify: responseShopify,
                    //     woo: 'notYet'
                    // }
                    res.status(200).send(responseShopify);
                }
                else {
                    console.log("Response", DataResponse);
                    res.status(422).send("Pagamento não realizado, tente novamente");
                }

            }).catch(function (error) {
                console.log("Erro MP", error);
                if (error.cause != undefined) {
                    console.log(error.cause[0].code);
                    res.status(422).send("Pagamento não realizado, tente novamente");
                }
                else {
                    res.status(422).send("Pagamento não realizado, tente novamente");
                }
            });


    } catch (error) {
        res.json(error);
        res.end();
    }
}

module.exports.GetIntegracaoCheckout = (req, res, next) => {
    try {
        pool.query('SELECT * FROM integracao_checkout', (error, results) => {
            if (error) {
                throw error
            }
            res.status(200).send(results.rows);
            res.end();
        })
    } catch (error) {
        res.json(error);
        res.end();
    }
}

module.exports.GetIntegracaoCheckoutByID = (req, res, next) => {
    try {
        const { id_usuario, id } = req.body;

        pool.query('SELECT * FROM checkouts where id_usuario = $1 and gateway=$2', [id_usuario, id], (error, results) => {
            if (error) {
                throw error
            }
            res.status(200).send(results.rows[0]);
            res.end();
        })
    } catch (error) {
        res.json(error);
        res.end();
    }
}
module.exports.InsertCheckoutMP = (req, res, next) => {
    try {
        const { id_usuario, status, nome, nome_fatura, processa_automaticamente, chave_publica, token_acesso, ativa_boleto, gateway, merchan_id, api_login, api_key, account_id, mostra_prova_social, json_checkout, limite_ip } = req.body;

        if (status == 1) {
            pool.query('UPDATE checkouts SET status=0 where id_usuario = $1', [id_usuario], (error, results) => {
                if (error) {
                    throw error
                }
                pool.query('INSERT INTO checkouts (id_usuario, status, nome, nome_fatura, captura_auto, chave_publica, token_acesso, ativa_boleto, gateway, merchan_id, api_login, api_key, account_id, mostra_prova_social, json_checkout,limite_ip)  VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15,$16) ON CONFLICT (gateway,id_usuario) DO UPDATE SET id_usuario=$1, status=$2, nome=$3, nome_fatura=$4, captura_auto=$5, chave_publica=$6, token_acesso=$7, ativa_boleto=$8, gateway=$9, merchan_id=$10, api_login=$11, api_key=$12, account_id=$13, mostra_prova_social=$14, json_checkout=$15,limite_ip=$16 ', [id_usuario, +status, nome, nome_fatura, processa_automaticamente, chave_publica, token_acesso, parseInt(ativa_boleto), gateway, merchan_id, api_login, api_key, account_id, +mostra_prova_social, json_checkout, limite_ip], (error, results) => {
                    if (error) {
                        throw error
                    }
                    res.status(200).send(results.rows[0]);
                    res.end();
                })
            })
        }
        else {
            pool.query('INSERT INTO checkouts (id_usuario, status, nome, nome_fatura, captura_auto, chave_publica, token_acesso, ativa_boleto, gateway, merchan_id, api_login, api_key, account_id, mostra_prova_social, json_checkout,limite_ip)  VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14,$15,$16) ON CONFLICT (gateway,id_usuario) DO UPDATE SET status=$2, nome=$3, nome_fatura=$4, captura_auto=$5, chave_publica=$6, token_acesso=$7, ativa_boleto=$8, gateway=$9, merchan_id=$10, api_login=$11, api_key=$12, account_id=$13, mostra_prova_social=$14, json_checkout=$15,limite_ip=$16 ', [id_usuario, +status, nome, nome_fatura, processa_automaticamente, chave_publica, token_acesso, parseInt(ativa_boleto), gateway, merchan_id, api_login, api_key, account_id, +mostra_prova_social, json_checkout, limite_ip], (error, results) => {
                if (error) {
                    throw error
                }
                res.status(200).send(results.rows[0]);
                res.end();
            })
        }

    } catch (error) {
        res.json(error);
        res.end();
    }
}

module.exports.UpdateStatusMP = (req, res, next) => {
    try {
        const { id_usuario, gateway, status } = req.body;
        //console.log(req.body);
        pool.query('UPDATE checkouts SET status=0 where id_usuario = $1', [id_usuario], (error, results) => {
            if (error) {
                throw error
            }
            pool.query('UPDATE checkouts SET status=$3 where id_usuario = $1 and gateway=$2', [id_usuario, gateway, +status], (error, results) => {
                if (error) {
                    throw error
                }
                res.status(200).send(results.rows[0]);
                res.end();
            })
        })

    } catch (error) {
        res.json(error);
        res.end();
    }
}

module.exports.UpdateAtivaBoletoMP = (req, res, next) => {
    try {
        const { id_usuario, gateway, ativa_boleto } = req.body;
        //console.log(req.body);
        pool.query('UPDATE checkouts SET ativa_boleto=$3 where id_usuario = $1 and gateway=$2', [id_usuario, gateway, parseInt(ativa_boleto)], (error, results) => {
            if (error) {
                throw error
            }
            res.status(200).send(results.rows[0]);
            res.end();
        })
    } catch (error) {
        res.json(error);
        res.end();
    }
}
module.exports.UpdateAutoProcessamentoMP = (req, res, next) => {
    try {
        const { id_usuario, gateway, processa_automaticamente } = req.body;
        //console.log(req.body);
        pool.query('UPDATE checkouts SET captura_auto=$3 where id_usuario = $1 and gateway=$2', [id_usuario, gateway, processa_automaticamente], (error, results) => {
            if (error) {
                throw error
            }
            res.status(200).send(results.rows[0]);
            res.end();
        })
    } catch (error) {
        res.json(error);
        res.end();
    }
}


module.exports.GetIntegracaoCheckoutInternal = () => {
    return new Promise((resolve, reject) => {
        try {
            pool.query('SELECT * FROM integracao_checkout', (error, results) => {
                if (error) {
                    throw error
                }
                resolve(results.rows);
            })
        } catch (error) {
            reject(error);
        }
    })

}