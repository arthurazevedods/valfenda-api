const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const {
    addBook,
    getAllBooks,
    updateBook,
    deleteBook,
} = require('../controllers/bookController');

// Rotas para livro
router.post('/', authMiddleware, addBook); // Adicionar livro
router.get('/', authMiddleware, getAllBooks); // Obter todos os livros
router.put('/:id', authMiddleware, updateBook); // Atualizar livro
router.delete('/:id', authMiddleware, deleteBook); // Deletar livro

module.exports = router;
