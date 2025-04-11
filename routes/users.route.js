// routes/user.route.js

const express = require('express')
const router = express.Router()

// Importa el controlador que ahora utiliza Knex.js para las consultas
const userController = require('../controllers/user.controller')

// Importa el middleware de autenticación
const authMiddleware = require('../middlewares/authMiddleware')

/**
 * @route   POST /api/users/register
 * @desc    Registro de un nuevo usuario (professional o client)
 * @access  Public
 */
router.post('/register', userController.register)

/**
 * @route   POST /api/users/login
 * @desc    Autenticación de usuario y generación de token JWT
 * @access  Public
 */
router.post('/login', userController.login)

/**
 * @route   GET /api/users/profile
 * @desc    Obtiene la información del perfil del usuario autenticado
 * @access  Private
 */
router.get('/profile', authMiddleware, userController.getProfile)

/**
 * @route   PUT /api/users/profile
 * @desc    Actualiza la información del perfil del usuario autenticado
 * @access  Private
 */
router.put('/profile', authMiddleware, userController.updateProfile)

/**
 * @route   GET /api/users
 * @desc    Lista todos los usuarios (opcionalmente filtrando por rol)
 * @access  Private
 */
router.get('/', authMiddleware, userController.listUsers)

/**
 * @route   DELETE /api/users/delete
 * @desc    Elimina la cuenta del usuario autenticado
 * @access  Private
 */
router.delete('/delete', authMiddleware, userController.deleteAccount)

/**
 * @route   POST /api/users/recover
 * @desc    Envía solicitud para recuperar la contraseña (se simula envío de correo)
 * @access  Public
 */
router.post('/recover', userController.recoverPassword)

/**
 * @route   POST /api/users/reset
 * @desc    Resetea la contraseña utilizando el token de recuperación
 * @access  Public
 */
router.post('/reset', userController.resetPassword)

module.exports = router
