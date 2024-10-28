const mongoose = require('mongoose');

// Definindo o schema para Editora
const publisherSchema = new mongoose.Schema({
    name: { type: String, required: true },
});

// Criando o modelo
const Publisher = mongoose.model('Publisher', publisherSchema);

module.exports = Publisher;
