const jwt = require('jsonwebtoken');

function authenticate(req, res, next) {
  const authorization = req.get('authorization');

  if (!authorization) {
    return res.status(401).json({ error: 'Debes iniciar sesión para continuar.' });
  }

  const [scheme, token, ...extraParts] = authorization.trim().split(/\s+/);
  if (scheme !== 'Bearer' || !token || extraParts.length) {
    return res.status(401).json({ error: 'El encabezado de autenticación no es válido.' });
  }

  if (!process.env.JWT_SECRET) {
    return next(new Error('JWT_SECRET no está configurada.'));
  }

  try {
    req.usuario = jwt.verify(token, process.env.JWT_SECRET, {
      algorithms: ['HS256'],
    });
    return next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'La sesión ha expirado. Inicia sesión de nuevo.' });
    }

    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ error: 'El token de autenticación no es válido.' });
    }

    return next(error);
  }
}

module.exports = { authenticate };
