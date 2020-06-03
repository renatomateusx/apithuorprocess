var pool = require('../db/queries');
var jwt = require('jsonwebtoken');
const UTILIS = require('../resources/util');
const utilisEmail = require('../routes/services/utilis');
const constantes = require('../resources/constantes');
const path = require("path");
const fs = require('fs');




module.exports.GetUserByID = (req, res, next) => {
    return new Promise((resolve, reject) => {
        try {
            const { id } = req.body;
            pool.query('SELECT * FROM usuarios WHERE id = $1', [id], (error, results) => {
                if (error) {
                    throw error
                }
                resolve(results.rows);
            })
        } catch (error) {
            reject(error);

        }
    });
}

module.exports.GetUserByIDExternal = (req, res, next) => {
    return new Promise((resolve, reject) => {
        try {
            const { id } = req.body;
            pool.query('SELECT * FROM usuarios WHERE id = $1', [id], (error, results) => {
                if (error) {
                    throw error
                }
                res.status(200).send(results.rows[0]);
            })
        } catch (error) {
            reject(error);

        }
    });
}

module.exports.GetUserByIDInternal = (id) => {
    return new Promise((resolve, reject) => {
        try {
            pool.query('SELECT * FROM usuarios WHERE id = $1', [id], (error, results) => {
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

module.exports.GetUsers = (req, res, next) => {
    try {
        pool.query('SELECT * FROM usuarios', (error, results) => {
            if (error) {
                throw error
            }
            res.status(200).json(results.rows);

        })
    } catch (error) {
        res.json(error);
        res.end();
    }
}

module.exports.SolicitarProposta = (req, res, next) => {
    try {
        const { nome, email, senha } = req.body

        pool.query('INSERT INTO proposta (nome, email, telefone, faturamento, mensagem, objetivo) VALUES ($1, $2, $3,$4,$5,$6)', [nome, email, telefone, faturamento, mensagem, objetivo], (error, results) => {
            if (error) {
                throw error
            }
            res .status(201).send(`Proposta Adicionada: ${result.insertId}`)
        })
    } catch (error) {
        res.json(error);
        res.end();
    }
}

module.exports.GetUserByProfile = (req, res, next) => {
    try {
        const email = parseInt(req.params.email)

        pool.query('SELECT * FROM usuarios WHERE email = $1', [email], (error, results) => {
            if (error) {
                throw error
            }
            res.status(200).json(results.rows)
        })
    } catch (error) {
        res.json(error);
        res.end();
    }
}

module.exports.VerificaRedefineSenha = (req, res, next) => {
    try {
        const { email } = req.body

        pool.query('SELECT * FROM usuarios WHERE email = $1', [email], (error, results) => {
            if (error) {
                throw error
            }
            if (results.rowCount > 0) {
                res.status(200).json('E-mail de Redefinição de Senha Enviado.');
                this.EnviaEsqueceuSenhaEmail(email, results.rows[0].nome);
            } else {
                res.status(422).json('Nenhuma Conta encontrada.');
            }

        })
    } catch (error) {
        res.json(error);
        res.end();
    }
}

module.exports.GetUserByEmail = (req, res, next) => {
    try {
        const { email } = req.body
        pool.query('SELECT * FROM usuarios WHERE email = $1', [email], (error, results) => {
            if (error) {
                throw error
            }
            if(results.rowCount > 0){
                res.status(200).json(true);
            }
            else{
                res.status(200).json(false);
            }
           
        })
    } catch (error) {
        res.json(error);
        res.end();
    }
}

module.exports.EfetuaLogin = (req, res, next) => {
    try {
        if (req.body !== undefined) {
            const { email, senha } = req.body

            pool.query('SELECT * FROM usuarios WHERE email = $1 and senha = $2', [email, senha], (error, results) => {
                if (error) {
                    throw error
                }
                if (results.rows[0]) {
                    const id = results.rows[0].id;

                    var token = jwt.sign({ id }, process.env.SECRET, {
                        expiresIn: '4h',
                    });
                    let LRetornoLogin = {
                        user: results.rows[0],
                        auth: token.length > 0,
                        token: token
                    };
                    //console.log("Enviando", LRetornoLogin);
                    res.status(200).json(LRetornoLogin);

                } else {
                    res.status(401).json({ mensagem: 'Login e a Senha inválidos!' });
                }

            })
        } else {
            res.status(500).send('Informe o Login e a Senha!');
        }
    } catch (error) {
        res.json(error);
        res.end();
    }
}

module.exports.AddUser = (req, res, next) => {
    try {
        const { nome, email, senha } = req.body

        pool.query('INSERT INTO usuarios (nome, email, senha) VALUES ($1, $2, $3)', [nome, email, senha], (error, results) => {
            if (error) {
                throw error
            }
            if (results.rowCount > 0) {
                res.status(200).json(`Usuário Criado: ${results.insertId}`)
                this.EnviaAtivacaoEmail(nome, email);
            }
            else {
                res.status(422).json('Erro ao criar usuário', results);
            }

        })
    } catch (error) {
        res.json(error);
        res.end();
    }
}

module.exports.UpdateUser = (req, res, next) => {
    try {
        const { id, plano, json_plano_pagamento, proximo_pagamento } = req.body;
        pool.query('UPDATE usuarios SET plano=$1, json_pagamento=$2, proximo_pagamento=$4 WHERE id=$3', [plano, json_plano_pagamento, id, proximo_pagamento], (error, results) => {
            if (error) {
                throw error
            }
            if (results.rowCount > 0) {
                res.status(200).json(`Usuário Atualizado`);
            }
            else {
                res.status(422).json('Erro ao criar usuário', results);
            }

        })
    } catch (error) {
        res.json(error);
        res.end();
    }
}

module.exports.AtivarEmail = (req, res, next) => {
    return new Promise((resolve, reject) => {
        try {
            const { token } = req.body;
            var LToken = UTILIS.getDecrypto(token);
            var LNome = LToken.split('|')[0];
            var LEmail = LToken.split('|')[1];
            pool.query('UPDATE usuarios SET status = 1 WHERE email = $1', [LEmail], (error, results) => {
                if (error) {
                    throw error
                }
                if (results.rowCount > 0) {
                    let LJSON = { status: 'Conta ativada com sucesso!', nome: LNome.split(' ')[0], email: LEmail };
                    res.status(200).json(LJSON);
                }
                else {
                    res.status(422).json('Conta não encontrada!');
                }
            })
        } catch (error) {
            console.log("Error", error);
            res.status(422).json('Erro ao tentar ativar conta:' + error);
        }
    });
}

module.exports.AlterarSenha = (req, res, next) => {
    return new Promise((resolve, reject) => {
        try {
            const { token, senha } = req.body;
            var LToken = UTILIS.getDecrypto(token);
            var LNome = LToken.split('|')[0];
            var LEmail = LToken.split('|')[1];
            pool.query('UPDATE usuarios SET senha = $1 WHERE email = $2 and nome = $3', [senha ,LEmail, LNome], (error, results) => {
                if (error) {
                    throw error
                }
                if (results.rowCount > 0) {
                    let LJSON = { status: 'Senha Alterada com Sucesso!', nome: LNome, email: LEmail };
                    this.EnviaEmailInformandoAlteracaoSenha(LEmail, LNome);
                    res.status(200).json(LJSON);
                }
                else {
                    res.status(422).json('Conta não encontrada!');
                }
            })
        } catch (error) {
            console.log("Error", error);
            res.status(422).json('Erro ao tentar ativar conta:' + error);
        }
    });
}

module.exports.EnviaAtivacaoEmail = (nome, email) => {
    return new Promise((resolve, reject) => {
        try {
            //const { nome, email } = req.body;
            //console.log(req.body);
            var LSiteActivate = constantes.WEBSITE_ACTIVATE_EMAIL;
            var template = path.resolve('public/templates/template_ativar_conta.html');
            fs.readFile(template, 'utf8', async function (err, html) {
                if (err) {
                    throw err;
                }
                var LHTML = html;
                var LNome = nome.split(' ')[0];
                LHTML = LHTML.replace("{first_name}", UTILIS.toCamelCase(LNome));
                LTitulo = constantes.STRING_SUBJECT_EMAIL_ATIVAR_CONTA;
                var arrayAttachments = constantes.attachmentsEmailAtivacao;
                arrayAttachments.forEach((obj, i) => {
                    obj.path = constantes.URL_PUBLIC_RESOURCES_EMAIL + '/' + obj.filename
                });
                LSiteActivate = LSiteActivate + await UTILIS.getCrypto(nome, email);
                LHTML = LHTML.replace("{link_ativacao}", LSiteActivate);

                const LRetornoMail = await utilisEmail.SendMail(email, LTitulo, LHTML, arrayAttachments);
                if (LRetornoMail == 1) {
                    //res.status(200).send('E-mail de ativação enviado');
                    resolve(1);
                }

            });
        } catch (error) {
            console.log(error);
            // res.json(error);
            // res.end();
            reject(error);
        }
    });
}


module.exports.EnviaAtivacaoEmailInternal = (req, res, next) => {
    return new Promise((resolve, reject) => {
        try {
            const { nome, email } = req.body;
            //console.log(req.body);
            var LSiteActivate = constantes.WEBSITE_ACTIVATE_EMAIL;
            var template = path.resolve('public/templates/template_ativar_conta.html');
            fs.readFile(template, 'utf8', async function (err, html) {
                if (err) {
                    throw err;
                }
                var LHTML = html;
                var LNome = nome.split(' ')[0];
                LHTML = LHTML.replace("{first_name}", UTILIS.toCamelCase(LNome));
                LTitulo = constantes.STRING_SUBJECT_EMAIL_ATIVAR_CONTA;
                var arrayAttachments = constantes.attachmentsEmailAtivacao;
                arrayAttachments.forEach((obj, i) => {
                    obj.path = constantes.URL_PUBLIC_RESOURCES_EMAIL + '/' + obj.filename
                });
                LSiteActivate = LSiteActivate + await UTILIS.getCrypto(nome, email);
                LHTML = LHTML.replace("{link_ativacao}", LSiteActivate);

                const LRetornoMail = await utilisEmail.SendMail(email, LTitulo, LHTML, arrayAttachments);
                if (LRetornoMail == 1) {
                    res.status(200).send('E-mail de ativação enviado');
                    //resolve(1);
                }

            });
        } catch (error) {
            console.log(error);
            res.json(error);
            res.end();
            //reject(error);
        }
    });
}

module.exports.EnviaEsqueceuSenhaEmail = (email, nome) => {
    return new Promise((resolve, reject) => {
        try {
            //console.log(req.body);
            var LSiteActivate = constantes.WEBSITE_ACTIVATE_RESET_SENHA;
            var template = path.resolve('public/templates/template_esqueci_senha.html');
            fs.readFile(template, 'utf8', async function (err, html) {
                if (err) {
                    throw err;
                }
                var LHTML = html;
                var LNome = nome.split(' ')[0];
                LHTML = LHTML.replace("{first_name}", UTILIS.toCamelCase(LNome));
                LTitulo = constantes.STRING_SUBJECT_EMAIL_ESQUECEU_SENHA;
                var arrayAttachments = constantes.attachmentsAux.concat(constantes.attachmentsEmailRedefineSenha);
                arrayAttachments.forEach((obj, i) => {
                    obj.path = constantes.URL_PUBLIC_RESOURCES_EMAIL + '/' + obj.filename
                });
                LSiteActivate = LSiteActivate + await UTILIS.getCrypto(nome, email);
                LHTML = LHTML.replace("{link_ativacao}", LSiteActivate);

                const LRetornoMail = await utilisEmail.SendMail(email, LTitulo, LHTML, arrayAttachments);
                if (LRetornoMail == 1) {
                    //res.status(200).send('E-mail de redefinição enviado');
                    resolve(1);
                }

            });
        } catch (error) {
            console.log(error);
            res.json(error);
            res.end();
            //reject(error);
        }
    });
}

module.exports.EnviaEmailInformandoAlteracaoSenha = (email, nome) => {
    return new Promise((resolve, reject) => {
        try {
            //console.log(req.body);
            var LSiteActivate = constantes.WEBSITE_ACTIVATE_RESET_SENHA;
            var template = path.resolve('public/templates/template_alterou_senha.html');
            fs.readFile(template, 'utf8', async function (err, html) {
                if (err) {
                    throw err;
                }
                var LHTML = html;
                var LNome = nome.split(' ')[0];
                LHTML = LHTML.replace("{first_name}", UTILIS.toCamelCase(LNome));
                LTitulo = constantes.STRING_SUBJECT_EMAIL_ALTEROU_SENHA;
                var arrayAttachments = constantes.attachmentsAux.concat(constantes.attachmentsEmailRedefineSenha);
                arrayAttachments.forEach((obj, i) => {
                    obj.path = constantes.URL_PUBLIC_RESOURCES_EMAIL + '/' + obj.filename
                });
                LSiteActivate = LSiteActivate + await UTILIS.getCrypto(nome, email);
                LHTML = LHTML.replace("{link_ativacao}", '');

                const LRetornoMail = await utilisEmail.SendMail(email, LTitulo, LHTML, arrayAttachments);
                if (LRetornoMail == 1) {
                    //res.status(200).send('E-mail de redefinição enviado');
                    resolve(1);
                }

            });
        } catch (error) {
            console.log(error);
            res.json(error);
            res.end();
            //reject(error);
        }
    });
}

module.exports.EnviaEsqueceuSenhaEmailInternal = (req, res, next) => {
    return new Promise((resolve, reject) => {
        try {
            const { nome, email } = req.body;
            //console.log(req.body);
            var LSiteActivate = constantes.WEBSITE_ACTIVATE_RESET_SENHA;
            var template = path.resolve('public/templates/template_esqueci_senha.html');
            fs.readFile(template, 'utf8', async function (err, html) {
                if (err) {
                    throw err;
                }
                var LHTML = html;
                var LNome = nome.split(' ')[0];
                LHTML = LHTML.replace("{first_name}", UTILIS.toCamelCase(LNome));
                LTitulo = constantes.STRING_SUBJECT_EMAIL_ESQUECEU_SENHA;
                var arrayAttachments = constantes.attachmentsAux.concat(constantes.attachmentsEmailRedefineSenha);
                arrayAttachments.forEach((obj, i) => {
                    obj.path = constantes.URL_PUBLIC_RESOURCES_EMAIL + '/' + obj.filename
                });
                LSiteActivate = LSiteActivate + await UTILIS.getCrypto(nome, email);
                LHTML = LHTML.replace("{link_ativacao}", LSiteActivate);

                const LRetornoMail = await utilisEmail.SendMail(email, LTitulo, LHTML, arrayAttachments);
                if (LRetornoMail == 1) {
                    res.status(200).send('E-mail de redefinição enviado');
                    //resolve(1);
                }

            });
        } catch (error) {
            console.log(error);
            res.json(error);
            res.end();
            //reject(error);
        }
    });
}