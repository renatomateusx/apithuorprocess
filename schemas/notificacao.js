var mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1:27017/thuorbd');
var notificacaoSchema = new mongoose.Schema({
    id: String,
    email_origem: String,
    nome_origem: String,
    email_destino: String,
    nome_destino: String,
    data_notificacao:String,
    acao_notificacao:String,
    msg_notificacao:String,
    lida:Boolean,
}, { collection: 'notificacao' }
); 
module.exports = { Mongoose: mongoose, NotificacaoSchema: notificacaoSchema }