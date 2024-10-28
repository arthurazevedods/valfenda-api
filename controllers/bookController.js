const Book = require('../models/Book');

// Adicionar livro
const addBook = async (req, res) => {
    const { title, author, publisher, shelf } = req.body;
    try {
        const newBook = new Book({ title, author, publisher, shelf });
        await newBook.save();
        res.status(201).json(newBook);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao adicionar livro', error });
    }
};

// Obter todos os livros
const getAllBooks = async (req, res) => {
    try {
        const books = await Book.find().populate('author publisher shelf');
        res.status(200).json(books);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao obter livros', error });
    }
};

// Atualizar livro
const updateBook = async (req, res) => {
    const { id } = req.params;
    const { title, author, publisher, shelf } = req.body;
    try {
        const updatedBook = await Book.findByIdAndUpdate(id, { title, author, publisher, shelf }, { new: true });
        res.status(200).json(updatedBook);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao atualizar livro', error });
    }
};

// Deletar livro
const deleteBook = async (req, res) => {
    const { id } = req.params;
    try {
        await Book.findByIdAndDelete(id);
        res.status(204).send(); // No content
    } catch (error) {
        res.status(500).json({ message: 'Erro ao deletar livro', error });
    }
};

module.exports = {
    addBook,
    getAllBooks,
    updateBook,
    deleteBook,
};
