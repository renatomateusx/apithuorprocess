var mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1:27017/thuorbd');

var tokenPagamentoSchema = new mongoose.Schema({
    id: String,
    token_pagamento: String,
    mes_referencia: String,
    token_confirmado: Boolean,
    email_usuario: String
}, { collection: 'tokenpagamento' }
);
module.exports = { Mongoose: mongoose, TokenPagamentoSchema: tokenPagamentoSchema }

