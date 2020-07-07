var pool = require('../db/queries');
var jwt = require('jsonwebtoken');
const constantes = require('../resources/constantes');
const utilis = require('../resources/util');
const format = require('string-format');
const transacoes = require('./transacao');
var moment = require("moment");
module.exports.GetClientes = (req, res, next) => {
    try {
        const { id_usuario } = req.body;
        pool.query('SELECT * FROM up_sell where id_usuario = $1', [id_usuario], (error, results) => {
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

module.exports.SaveClientes = (req, res, next) => {
    try {
        const { id_usuario, id_produto_selecionado_um, id_produto_selecionado_dois, nome, status, tipo_checkout, quantidade, preco, assunto_email, mensagem_sms } = req.body;
        pool.query('INSERT INTO up_sell (id_usuario, id_produto_from, id_produto_to, status, nome, tipo_checkout, quantidade, preco, assunto_email, mensagem_sms) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) ON CONFLICT (id_usuario, id_produto_from) DO UPDATE SET id_usuario=$1, id_produto_from=$2, id_produto_to=$3, status=$4, nome=$5, tipo_checkout=$6, quantidade=$7, preco=$8, assunto_email=$9, mensagem_sms=$10', [id_usuario, id_produto_selecionado_um, id_produto_selecionado_dois, status, nome, tipo_checkout, quantidade, preco, assunto_email, mensagem_sms], (error, results) => {
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
module.exports.DeleteClienteByID = (req, res, next) => {
    try {
        const { id, id_usuario } = req.body;
        pool.query('DELETE FROM  up_sell WHERE id = $1 and id_usuario = $2', [id, id_usuario], (error, results) => {
            if (error) {
                throw error
            }
            res.status(200).send();
            res.end();
        })
    } catch (error) {
        res.json(error);
        res.end();
    }
}

module.exports.GetClienteByID = (req, res, next) => {
    try {
        const { id_usuario, id_produto } = req.body;
        pool.query('SELECT * FROM up_sell where id_usuario = $1 and id_produto_from = $2', [id_usuario, id_produto], (error, results) => {
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

module.exports.SaveLead = async (req, res, next) => {
    try {
        const { nome, email, id_usuario, telefone, lead } = req.body;
        const Lead = JSON.parse(Buffer.from(lead, 'base64').toString());
        const LLeadBuyer = await module.exports.GetDadosCompradorLeadInternal(email);
        const LLedB = JSON.stringify(LLeadBuyer.lead.dadosComprador);
        const LLength = JSON.stringify(Lead.dadosComprador);
        if (LLedB.length > LLength.length) {
            res.json(1);
            res.end();
        } else {
            const LData = moment().format();
            const LCampanhaEnviar = 1;
            pool.query('insert into lead (email, nome, id_usuario, telefone, lead, data_produtos_carrinho, campanha_enviar) VALUES ($1, $2, $3, $4, $5,$6,$7) ON CONFLICT (email) DO UPDATE SET email=$1, nome=$2, id_usuario=$3, telefone=$4, lead=$5, data_produtos_carrinho=$6, campanha_enviar=$7', [email, nome, id_usuario, telefone, Lead, LData, LCampanhaEnviar], (error, results) => {
                if (error) {
                    throw error
                }
                res.status(200).send(results.rows);
                res.end();
            })
        }
    } catch (error) {
        res.json(error);
        res.end();
    }
}

module.exports.UpdateLead = (email, produtos_comprados) => {
    return new Promise((resolve, reject) => {
        try {
            const data = moment().format();
            pool.query('UPDATE lead set ultimos_produtos_comprados = $1, data_ultima_compra = $2 where email = $3', [produtos_comprados, data, email], (error, results) => {
                if (error) {
                    throw error
                }
                resolve(1);
            })
        } catch (error) {
            reject(error);
        }
    })

}

module.exports.UpdateLeadCampanha = (PUltimoEmailEnviado, PCampanhaEmailEnviada, PSequenciaEnviada, PIdLead) => {
    return new Promise((resolve, reject) => {
        try {
            const data = moment().format();
            pool.query('UPDATE carrinho_abandonado set data_ultimo_email_enviado = $1, campanha_email_enviada = $2, sequencia_enviada = $3 where id_cart = $4', [PUltimoEmailEnviado, PCampanhaEmailEnviada, PSequenciaEnviada, PIdLead], (error, results) => {
                if (error) {
                    throw error
                }
                resolve(1);
            })
        } catch (error) {
            reject(error);
        }
    })

}

module.exports.GetDadosCompradorLead = (req, res, next) => {
    return new Promise((resolve, reject) => {
        try {
            const { email } = req.body;
            pool.query('SELECT * FROM lead WHERE email = $1', [email], (error, results) => {
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
    })

}

module.exports.GetDadosCompradorLeadInternal = (email) => {
    return new Promise((resolve, reject) => {
        try {
            pool.query('SELECT * FROM lead WHERE email = $1', [email], (error, results) => {
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

module.exports.GetLeadCronJob = (req, res, next) => {
    return new Promise((resolve, reject) => {
        try {
            pool.query('SELECT * FROM carrinho_abandonado WHERE campanha_enviar = 1 and status =0', (error, results) => {
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
