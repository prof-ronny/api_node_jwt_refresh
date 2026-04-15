const Usuario = require('../models/Usuario');
const RefreshToken = require('../models/RefreshToken');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.registrar = async (req, res) => {
  const { nome, email, senha } = req.body;

  try {
    const senhaHash = bcrypt.hashSync(senha, 10);
    const usuario = new Usuario({ nome, email, senhaHash });
    await usuario.save();

    res.status(201).json({ mensagem: 'Usuário criado com sucesso' });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ mensagem: 'Email já cadastrado' });
    }

    res.status(500).json({ mensagem: 'Erro ao registrar', detalhe: err.message });
  }
};

exports.login = async (req, res) => {
  const { email, senha } = req.body;

  try {
    const usuario = await Usuario.findOne({ email });
    if (!usuario) {
      return res.status(404).json({ mensagem: 'Usuário não encontrado' });
    }

    const senhaValida = bcrypt.compareSync(senha, usuario.senhaHash);
    if (!senhaValida) {
      return res.status(401).json({ mensagem: 'Senha incorreta' });
    }

    const accessToken = jwt.sign(
      { id: usuario._id, tipo: 'access' },
      process.env.JWT_SECRET,
      { expiresIn: '15m' }
    );

    const refreshToken = jwt.sign(
      { id: usuario._id, tipo: 'refresh' },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    await RefreshToken.create({
      token: refreshToken,
      usuarioId: usuario._id,
      expiracao: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    });

    res.json({ accessToken, refreshToken });
  } catch (err) {
    res.status(500).json({ mensagem: 'Erro ao autenticar', detalhe: err.message });
  }
};