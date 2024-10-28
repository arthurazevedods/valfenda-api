const mongoose = require('mongoose');

const db = () => {
    mongoose.connect(process.env.MONGO_URI)
        .then(() => console.log('Conectado ao MongoDB'))
        .catch((error) => console.error('Erro ao conectar ao MongoDB:', error));
};

module.exports = db;