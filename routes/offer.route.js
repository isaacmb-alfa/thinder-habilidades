const express = require('express')
const router = express.Router()

// Importamos el controlador de ofertas y el middleware de autenticación
const offerController = require('../controllers/offer.controller')
const authMiddleware = require('../middlewares/authMiddleware')

/**
 * @route   POST /api/offers
 * @desc    Crea una nueva oferta desde un usuario cliente
 * @access  Private (requiere autenticación y rol "client")
 */
router.post('/', authMiddleware, offerController.createOffer)

/**
 * @route   GET /api/offers/client
 * @desc    Lista las ofertas activas creadas por el cliente autenticado
 * @access  Private (solo para usuarios con rol "client")
 */
router.get('/client', authMiddleware, offerController.listActiveOffersForClient)

/**
 * @route   GET /api/offers/professional
 * @desc    Lista las ofertas a las que el profesional está asignado (postulados)
 * @access  Private (solo para usuarios con rol "professional")
 */
router.get('/professional', authMiddleware, offerController.listOffersForProfessional)

module.exports = router
