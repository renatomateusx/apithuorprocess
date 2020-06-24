var pool = require('../db/queries');
var jwt = require('jsonwebtoken');
const constantes = require('../resources/constantes');
const utilis = require('../resources/util');
const format = require('string-format');
const produtos = require('../schemas/produtos');
var moment = require("moment");

module.exports.GetAllReviews = (req, res, next) => {
    try {
        const { id_usuario } = req.body;
        pool.query('SELECT * FROM reviews where id_usuario = $1', [id_usuario], (error, results) => {
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

module.exports.SaveReview = async (req, res, next) => {
    try {
        const { url_loja, id_produto, nome, email, titulo, avaliacao, imagem, plataforma, ratipostng } = req.body;
        var id_prod = id_produto;
        const LData = moment().format();
        const Prod = await produtos.GetProdutoByVariantIDInternal(id_produto);
        console.log("Prod", Prod);
        var img = imagem;
        if (Prod.id_produto_json) {
            id_prod = Prod.id_produto_json;
        }
        return;
        //if (img.length == 0) {
        //img = Prod.variant_img;
        //}
        pool.query('INSERT INTO reviews (url_loja, id_produto,nome,email,titulo,avaliacao,imagem,data, plataforma,rating) VALUES ($1,$2,$3,$4,$5,$6,$7,$8, $9, $10)', [url_loja, id_prod, nome, email, titulo, avaliacao, img, LData, plataforma, rating], (error, results) => {
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
module.exports.GetReviewByID = async (req, res, next) => {
    try {
        const { id_produto } = req.body;

        const Prod = await produtos.GetProdutoByVariantIDInternal(id_produto);
        if (Prod) {
            pool.query('SELECT * FROM reviews WHERE id_produto = $1', [Prod.id_produto_json], (error, results) => {
                if (error) {
                    throw error
                }
                res.status(200).send(results.rows);
                res.end();
            })
        } else {
            pool.query('SELECT * FROM reviews WHERE id_produto = $1', [id_produto], (error, results) => {
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

module.exports.GetReviewByIDOld = (req, res, next) => {
    try {
        const { id_produto, url_loja } = req.body;
        pool.query('SELECT * FROM reviews WHERE id_produto = $1 and url_loja = $2', [id_produto, url_loja], (error, results) => {
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

module.exports.DeleteReviewByID = (req, res, next) => {
    try {
        const { id } = req.body;
        pool.query('DELETE FROM reviews where id = $1', [id], (error, results) => {
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