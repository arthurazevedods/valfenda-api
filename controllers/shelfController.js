const Shelf = require('../models/Shelf');

// Adicionar estante
const addShelf = async (req, res) => {
    const { name } = req.body;
    try {
        const newShelf = new Shelf({ name });
        await newShelf.save();
        res.status(201).json(newShelf);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao adicionar estante', error });
    }
};

// Obter todas as estantes
const getAllShelves = async (req, res) => {
    try {
        const shelves = await Shelf.find();
        res.status(200).json(shelves);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao obter estantes', error });
    }
};

// Atualizar estante
const updateShelf = async (req, res) => {
    const { id } = req.params;
    const { name } = req.body;
    try {
        const updatedShelf = await Shelf.findByIdAndUpdate(id, { name }, { new: true });
        res.status(200).json(updatedShelf);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao atualizar estante', error });
    }
};

// Deletar estante
const deleteShelf = async (req, res) => {
    const { id } = req.params;
    try {
        await Shelf.findByIdAndDelete(id);
        res.status(204).send(); // No content
    } catch (error) {
        res.status(500).json({ message: 'Erro ao deletar estante', error });
    }
};

module.exports = {
    addShelf,
    getAllShelves,
    updateShelf,
    deleteShelf,
};
