var mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1:27017/thuorbd');

var chatListSchema = new mongoose.Schema({
    id:String,
    idChat: String,
    usuario_from: String,
    usuario_to: String,
    lastmessage: String,
    datahora: String
}, { collection: 'chatlist' }
);

module.exports = { Mongoose: mongoose, ChatListSchema: chatListSchema }