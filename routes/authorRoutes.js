const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const {
    addAuthor,
    getAllAuthors,
    updateAuthor,
    deleteAuthor,
} = require('../controllers/authorController');

// Rotas para autor
router.post('/', authMiddleware, addAuthor); // Adicionar autor
router.get('/', authMiddleware, getAllAuthors); // Obter todos os autores
router.put('/:id', authMiddleware, updateAuthor); // Atualizar autor
router.delete('/:id', authMiddleware, deleteAuthor); // Deletar autor

module.exports = router;
