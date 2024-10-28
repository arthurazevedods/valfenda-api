const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Middleware para verificar o token JWT
const authMiddleware = async (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
        return res.status(401).json({ message: 'Acesso negado. Token não fornecido.' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id);

        if (!user) {
            return res.status(401).json({ message: 'Usuário não encontrado.' });
        }

        req.user = user;
        next();
    } catch (error) {
        res.status(401).json({ message: 'Token inválido.', error });
    }
};

module.exports = authMiddleware;
