const Author = require('../models/Author');

// Adicionar autor
const addAuthor = async (req, res) => {
    const { name } = req.body;
    try {
        const newAuthor = new Author({ name });
        await newAuthor.save();
        res.status(201).json(newAuthor);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao adicionar autor', error });
    }
};

// Obter todos os autores
const getAllAuthors = async (req, res) => {
    try {
        const authors = await Author.find();
        res.status(200).json(authors);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao obter autores', error });
    }
};

// Atualizar autor
const updateAuthor = async (req, res) => {
    const { id } = req.params;
    const { name } = req.body;
    try {
        const updatedAuthor = await Author.findByIdAndUpdate(id, { name }, { new: true });
        res.status(200).json(updatedAuthor);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao atualizar autor', error });
    }
};

// Deletar autor
const deleteAuthor = async (req, res) => {
    const { id } = req.params;
    try {
        await Author.findByIdAndDelete(id);
        res.status(204).send(); // No content
    } catch (error) {
        res.status(500).json({ message: 'Erro ao deletar autor', error });
    }
};

module.exports = {
    addAuthor,
    getAllAuthors,
    updateAuthor,
    deleteAuthor,
};
