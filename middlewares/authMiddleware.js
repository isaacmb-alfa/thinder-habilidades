// authMiddleware.js

const jwt = require('jsonwebtoken')

// Clave secreta para JWT
const secretKey = process.env.JWT_SECRET

module.exports = (req, res, next) => {
  // Se espera que el token se envíe en la cabecera con el formato "Bearer <token>"
  const authHeader = req.headers.authorization
  if (!authHeader) {
    return res.status(401).json({ message: 'Authorization header missing' })
  }

  const token = authHeader.split(' ')[1]
  if (!token) {
    return res.status(401).json({ message: 'Access token missing' })
  }

  jwt.verify(token, secretKey, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Invalid token', error: err.message })
    }
    // Se añade la información decodificada al request para usarla en los controladores
    req.user = decoded
    next()
  })
}
