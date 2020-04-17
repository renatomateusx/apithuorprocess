var mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1:27017/thuorbd');
 
var superlikeSchema = new mongoose.Schema({
    id: String,
    email_origem: String,
    nome_origem: String,
    email_destino: String,
    nome_destino: String
}, { collection: 'superlikes' }
); 
module.exports = { Mongoose: mongoose, SuperLikeSchema: suplerlikeSchema }