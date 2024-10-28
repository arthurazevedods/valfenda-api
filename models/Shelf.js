const mongoose = require('mongoose');

// Definindo o schema para Prateleira
const shelfSchema = new mongoose.Schema({
    name: { type: String, required: true },
});

// Criando o modelo
const Shelf = mongoose.model('Shelf', shelfSchema);

module.exports = Shelf;
