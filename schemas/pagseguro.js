var mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1:27017/thuorbd');
 
var pagseguroSchema = new mongoose.Schema({
    id: String,
    email: String,
    token: String
}, { collection: 'pagseguro' }
); 
module.exports = { Mongoose: mongoose, PagSeguroSchema: pagseguroSchema }