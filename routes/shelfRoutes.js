const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const {
    addShelf,
    getAllShelves,
    updateShelf,
    deleteShelf,
} = require('../controllers/shelfController');

// Rotas para prateleiras
router.post('/', authMiddleware, addShelf); // Adicionar prateleira
router.get('/', getAllShelves); // Obter todas as prateleiras
router.put('/:id', authMiddleware, updateShelf); // Atualizar prateleira
router.delete('/:id', authMiddleware, deleteShelf); // Deletar prateleira

module.exports = router;
