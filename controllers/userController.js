const User = require('../models/User');

// Registrar novo usuário
const signUp = async (req, res) => {
    const { name, email, password } = req.body;
    try {
        const newUser = new User({ name, email, password });
        await newUser.save();
        res.status(201).json(newUser);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao cadastrar usuário', error });
    }
};
// Login do usuário
const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        
        if (!user || !(await user.comparePassword(password))) {
            return res.status(401).json({ message: 'Credenciais inválidas' });
        }
        res.status(200).json({ message: 'Login bem-sucedido', user });
    } catch (error) {
        res.status(500).json({ message: 'Erro ao fazer login', error: error.message });
    }
};

module.exports = {
    signUp,
    login,
};
