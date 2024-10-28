const mongoose = require('mongoose');

// Definindo o schema para Autor
const authorSchema = new mongoose.Schema({
    name: { type: String, required: true },
});

// Criando o modelo
const Author = mongoose.model('Author', authorSchema);

module.exports = Author;
