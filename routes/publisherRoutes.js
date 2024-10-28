const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const {
    addPublisher,
    getAllPublishers,
    updatePublisher,
    deletePublisher,
} = require('../controllers/publisherController');

// Rotas para editoras
router.post('/', authMiddleware, addPublisher); // Adicionar editora
router.get('/', authMiddleware, getAllPublishers); // Obter todas as editoras
router.put('/:id', authMiddleware, updatePublisher); // Atualizar editora
router.delete('/:id', authMiddleware, deletePublisher); // Deletar editora

module.exports = router;
