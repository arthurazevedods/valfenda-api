const mongoose = require('mongoose');

// Definindo o schema para Livro
const bookSchema = new mongoose.Schema({
    title: { type: String, required: true },
    publisher: { type: mongoose.Schema.Types.ObjectId, ref: 'Publisher' },
    authorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Author' },
    shelfId: { type: mongoose.Schema.Types.ObjectId, ref: 'Shelf' },
    version: { type: Number, default: 1 },
});

// Criando o modelo
const Book = mongoose.model('Book', bookSchema);

module.exports = Book;
