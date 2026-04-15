const express = require('express');
const app = express();
require('dotenv').config();
const mongoose = require('mongoose');
const cors = require('cors');

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB conectado'))
  .catch(err => console.error('Erro ao conectar no MongoDB:', err));

app.use(cors());
app.use(express.json({ limit: '1mb' }));

const usuarioRoutes = require('./routes/usuarioRoutes');
const authRoutes = require('./routes/authRoutes');
const contatoRoutes = require('./routes/contatoRoutes');
const uploadRoutes = require('./routes/uploadRoutes');

app.use('/usuarios', usuarioRoutes);
app.use('/auth', authRoutes);
app.use('/contatos', contatoRoutes);
app.use('/upload', uploadRoutes);

module.exports = app;