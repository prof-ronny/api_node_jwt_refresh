const Contato = require('../models/Contato');

exports.criar = async (req, res) => {
  const { nome, email, telefone, endereco, fotoId } = req.body;

  try {
    const contato = new Contato({
      nome,
      email,
      telefone,
      endereco,
      fotoId,
      usuarioId: req.usuarioId
    });

    await contato.save();
    res.status(201).json({ mensagem: 'Contato criado', contato });
  } catch (err) {
    res.status(500).json({ mensagem: 'Erro ao criar contato', detalhe: err.message });
  }
};

exports.listar = async (req, res) => {
  try {
    const contatos = await Contato.find({ usuarioId: req.usuarioId }).lean();
    res.json(contatos);
  } catch (err) {
    res.status(500).json({ mensagem: 'Erro ao listar contatos', detalhe: err.message });
  }
};

exports.buscarPorId = async (req, res) => {
  try {
    const contato = await Contato.findOne({ _id: req.params.id, usuarioId: req.usuarioId }).lean();

    if (!contato) {
      return res.status(404).json({ mensagem: 'Contato não encontrado' });
    }

    res.json(contato);
  } catch (err) {
    res.status(500).json({ mensagem: 'Erro ao buscar contato', detalhe: err.message });
  }
};

exports.atualizar = async (req, res) => {
  try {
    const atualizado = await Contato.findOneAndUpdate(
      { _id: req.params.id, usuarioId: req.usuarioId },
      req.body,
      { new: true }
    ).lean();

    if (!atualizado) {
      return res.status(404).json({ mensagem: 'Contato não encontrado' });
    }

    res.json(atualizado);
  } catch (err) {
    res.status(500).json({ mensagem: 'Erro ao atualizar contato', detalhe: err.message });
  }
};

exports.deletar = async (req, res) => {
  try {
    const excluido = await Contato.findOneAndDelete({ _id: req.params.id, usuarioId: req.usuarioId });

    if (!excluido) {
      return res.status(404).json({ mensagem: 'Contato não encontrado' });
    }

    res.json({ mensagem: 'Contato deletado' });
  } catch (err) {
    res.status(500).json({ mensagem: 'Erro ao deletar contato', detalhe: err.message });
  }
};