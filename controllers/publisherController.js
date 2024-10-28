const Publisher = require('../models/Publisher');

// Adicionar editor
const addPublisher = async (req, res) => {
    const { name } = req.body;
    try {
        const newPublisher = new Publisher({ name });
        await newPublisher.save();
        res.status(201).json(newPublisher);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao adicionar editor', error });
    }
};

// Obter todos os editores
const getAllPublishers = async (req, res) => {
    try {
        const publishers = await Publisher.find();
        res.status(200).json(publishers);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao obter editores', error });
    }
};

// Atualizar editor
const updatePublisher = async (req, res) => {
    const { id } = req.params;
    const { name } = req.body;
    try {
        const updatedPublisher = await Publisher.findByIdAndUpdate(id, { name }, { new: true });
        res.status(200).json(updatedPublisher);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao atualizar editor', error });
    }
};

// Deletar editor
const deletePublisher = async (req, res) => {
    const { id } = req.params;
    try {
        await Publisher.findByIdAndDelete(id);
        res.status(204).send(); // No content
    } catch (error) {
        res.status(500).json({ message: 'Erro ao deletar editor', error });
    }
};

module.exports = {
    addPublisher,
    getAllPublishers,
    updatePublisher,
    deletePublisher,
};
