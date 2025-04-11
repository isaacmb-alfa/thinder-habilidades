// controllers/user.controller.js

const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const knex = require('../db/knex')
const { validateEmail } = require('../utils/validators')

const secretKey = process.env.JWT_SECRET

/**
 * Registra un nuevo usuario.
 * Endpoint: POST /api/users/register
 */
exports.register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body

    // Verificar si el usuario ya existe
    const userExists = await knex('users').where({ email }).first()
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' })
    }

    if (!validateEmail(email)) {
      res.status(400).send({ message: 'Invalid email format' })
      return
    }

    // Encriptar la contraseña
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    // Insertar el nuevo usuario y devolver los datos insertados
    const [newUser] = await knex('users')
      .insert({
        name,
        email,
        password: hashedPassword,
        role,
        created_at: knex.fn.now(),
        updated_at: knex.fn.now()
      })
      .returning('*')

    res.status(201).json({ message: 'User registered successfully', user: newUser })
  } catch (error) {
    res.status(500).json({ message: 'Error registering user', error: error.message })
  }
}

/**
 * Autentica al usuario y genera un token JWT.
 * Endpoint: POST /api/users/login
 */
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body
    const user = await knex('users').where({ email }).first()

    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }
    if (!validateEmail(email)) {
      res.status(400).send({ message: 'Invalid email format' })
      return
    }

    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' })
    }

    // Crear payload y generar el token
    const payload = { id: user.id, email: user.email, role: user.role }
    const token = jwt.sign(payload, secretKey, { expiresIn: '1h' })

    res.json({ token })
  } catch (error) {
    res.status(500).json({ message: 'Error during login', error: error.message })
  }
}

/**
 * Obtiene la información del perfil del usuario autenticado.
 * Endpoint: GET /api/users/profile
 */
exports.getProfile = async (req, res) => {
  try {
    const userId = req.user.id
    const user = await knex('users')
      .select('id', 'name', 'email', 'role', 'created_at')
      .where({ id: userId })
      .first()

    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    res.json(user)
  } catch (error) {
    res.status(500).json({ message: 'Error getting profile', error: error.message })
  }
}

/**
 * Actualiza la información del perfil del usuario autenticado.
 * Endpoint: PUT /api/users/profile
 */
exports.updateProfile = async (req, res) => {
  try {
    const userId = req.user.id
    const { name, email, password } = req.body

    // Obtener los datos actuales del usuario
    const currentUser = await knex('users').where({ id: userId }).first()
    if (!currentUser) {
      return res.status(404).json({ message: 'User not found' })
    }

    // Definir valores actualizados; si no llegan por body, se conservan los actuales
    const updatedName = name || currentUser.name
    const updatedEmail = email || currentUser.email
    let updatedPassword = currentUser.password
    if (password) {
      const salt = await bcrypt.genSalt(10)
      updatedPassword = await bcrypt.hash(password, salt)
    }

    // Actualizar la información y devolver los datos actualizados
    const [updatedUser] = await knex('users')
      .update({
        name: updatedName,
        email: updatedEmail,
        password: updatedPassword,
        updated_at: knex.fn.now()
      })
      .where({ id: userId })
      .returning(['id', 'name', 'email', 'role', 'created_at', 'updated_at'])

    res.json({ message: 'Profile updated successfully', user: updatedUser })
  } catch (error) {
    res.status(500).json({ message: 'Error updating profile', error: error.message })
  }
}

/**
 * Lista todos los usuarios, con opción de filtrar por rol.
 * Endpoint: GET /api/users
 */
exports.listUsers = async (req, res) => {
  try {
    const { role } = req.query
    let query = knex('users').select('id', 'name', 'email', 'role', 'created_at')

    if (role) {
      query = query.where({ role })
    }

    const users = await query
    res.json(users)
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving users', error: error.message })
  }
}

/**
 * Elimina la cuenta del usuario autenticado.
 * Endpoint: DELETE /api/users/delete
 */
exports.deleteAccount = async (req, res) => {
  try {
    const userId = req.user.id
    const deleted = await knex('users').where({ id: userId }).del()

    if (deleted === 0) {
      return res.status(404).json({ message: 'User not found' })
    }

    res.json({ message: 'User successfully deleted' })
  } catch (error) {
    res.status(500).json({ message: 'Error deleting account', error: error.message })
  }
}

/**
 * Envía la solicitud de recuperación de contraseña.
 * En un entorno real se enviaría un correo con un token de recuperación.
 * Endpoint: POST /api/users/recover
 */
exports.recoverPassword = async (req, res) => {
  try {
    const { email } = req.body
    const user = await knex('users').where({ email }).first()

    if (!user) {
      return res.status(404).json({ message: 'Email not registered' })
    }

    const recoveryToken = jwt.sign({ id: user.id }, secretKey, { expiresIn: '15m' })
    // Aquí se simula el envío del token por correo.
    res.json({ message: `Password recovery email sent to ${email} (simulated)`, recoveryToken })
  } catch (error) {
    res.status(500).json({ message: 'Error in password recovery', error: error.message })
  }
}

/**
 * Resetea la contraseña del usuario utilizando el token de recuperación.
 * Endpoint: POST /api/users/reset
 */
exports.resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body
    const decoded = jwt.verify(token, secretKey)
    const userId = decoded.id

    // Encriptar la nueva contraseña
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(newPassword, salt)

    // Actualizar la contraseña y devolver el usuario actualizado
    const [updatedUser] = await knex('users')
      .update({
        password: hashedPassword,
        updated_at: knex.fn.now()
      })
      .where({ id: userId })
      .returning(['id', 'name', 'email', 'role', 'created_at', 'updated_at'])

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found for password reset' })
    }

    res.json({ message: 'Password reset successfully', user: updatedUser })
  } catch (error) {
    res.status(500).json({ message: 'Error resetting password', error: error.message })
  }
}
