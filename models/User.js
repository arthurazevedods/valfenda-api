const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Definindo o esquema do usuário
const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }
});

// Método para hash da senha antes de salvar
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

// Método para comparar a senha
userSchema.methods.comparePassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

// Criar o modelo
const User = mongoose.model('User', userSchema);

module.exports = User;
