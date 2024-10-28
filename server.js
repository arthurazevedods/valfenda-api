require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const userRoutes = require('./routes/userRoutes');
const authorRoutes = require('./routes/authorRoutes');
const bookRoutes = require('./routes/bookRoutes');
const publisherRoutes = require('./routes/publisherRoutes');
const shelfRoutes = require('./routes/shelfRoutes');
const db = require('./config/db');

// Criação do app antes de usar o cors
const app = express();

const PORT = process.env.PORT || 8080;

app.use(cors({
    origin: ["https://valfenda-client.vercel.app"],
    methods: ["POST", "GET", "UPDATE", "DELETE"],
    credentials: true
}));

app.use(express.json());

// Conectar ao MongoDB
db();

// Rotas
app.use('/api/users', userRoutes);
app.use('/api/authors', authorRoutes);
app.use('/api/books', bookRoutes);
app.use('/api/publishers', publisherRoutes);
app.use('/api/shelves', shelfRoutes);

app.get('/', (req, res) => {
    res.json('Servidor rodando e conectado ao MongoDB!');
});

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
