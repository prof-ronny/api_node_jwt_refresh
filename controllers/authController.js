const RefreshToken = require('../models/RefreshToken');
const jwt = require('jsonwebtoken');

exports.refresh = async (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(401).json({ mensagem: 'Refresh token ausente' });
  }

  try {
    // 1. Verifica se existe no banco
    const tokenSalvo = await RefreshToken.findOne({ token: refreshToken });
    if (!tokenSalvo) {
      return res.status(403).json({ mensagem: 'Refresh token inválido ou revogado' });
    }

    // 2. Verifica expiração salva no banco
    if (tokenSalvo.expiracao < new Date()) {
      await RefreshToken.deleteOne({ _id: tokenSalvo._id });
      return res.status(403).json({ mensagem: 'Refresh token expirado' });
    }

    // 3. Verifica o JWT
    jwt.verify(refreshToken, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        return res.status(403).json({ mensagem: 'Refresh token inválido' });
      }

      // 4. Garante que ele é mesmo do tipo refresh
      if (decoded.tipo !== 'refresh') {
        return res.status(403).json({ mensagem: 'Token inválido para refresh' });
      }

      // 5. Gera novo access token
      const novoAccessToken = jwt.sign(
        { id: decoded.id, tipo: 'access' },
        process.env.JWT_SECRET,
        { expiresIn: '15m' }
      );

      res.json({ accessToken: novoAccessToken });
    });
  } catch (err) {
    res.status(500).json({ mensagem: 'Erro ao renovar token', detalhe: err.message });
  }
};

exports.logout = async (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(400).json({ mensagem: 'Refresh token ausente' });
  }

  try {
    await RefreshToken.deleteOne({ token: refreshToken });
    res.json({ mensagem: 'Logout realizado com sucesso' });
  } catch (err) {
    res.status(500).json({ mensagem: 'Erro ao fazer logout', detalhe: err.message });
  }
};