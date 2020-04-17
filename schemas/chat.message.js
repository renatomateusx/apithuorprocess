var mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1:27017/thuorbd');

var chatSchema = new mongoose.Schema({
    id: String,
    idChat:String,
    usuario_from: String,
    usuario_to: String,
    message: String,
    datahora: String,
    nome: String
}, { collection: 'chat' }
);

module.exports = { Mongoose: mongoose, ChatSchema: chatSchema }