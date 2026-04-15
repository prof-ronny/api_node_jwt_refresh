const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ mensagem: 'Token ausente' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ mensagem: 'Token inválido' });
    }

    // Impede uso de refresh token no Bearer
    if (decoded.tipo !== 'access') {
      return res.status(403).json({ mensagem: 'Token inválido para acesso' });
    }

    req.usuarioId = decoded.id;
    next();
  });
};