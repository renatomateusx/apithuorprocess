var mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1:27017/thuorbd');
 
var combinacaoSchema = new mongoose.Schema({
    id: String,
    email_origem: String,
    nome_origem: String,
    email_destino: String,
    nome_destino: String
}, { collection: 'combinacao' }
); 
module.exports = { Mongoose: mongoose, CombinacaoSchema: combinacaoSchema }