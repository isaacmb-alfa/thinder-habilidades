/* eslint-disable camelcase */
// controllers/offer.controller.js

const knex = require('../db/knex')

/**
 * Crea una nueva oferta (offer) desde un usuario cliente.
 * Se espera que el cliente envíe en el body:
 * - professional_id: ID del profesional seleccionado
 * - hourly_rate: Tarifa por hora del profesional
 * - booked_hours: Cantidad de horas a contratar
 * - quote: Cotización o descripción de la oferta
 * - scheduled_date: Fecha y hora programada para el servicio
 *
 * Además, se verifica que el usuario autenticado tenga rol "client".
 */
exports.createOffer = async (req, res) => {
  try {
    if (req.user.role !== 'client') {
      return res.status(403).json({ message: 'Only clients can create offers' })
    }

    const { professional_id, hourly_rate, booked_hours, quote, scheduled_date } = req.body

    // Verificar que el profesional existe y tiene el rol correcto
    const professional = await knex('users')
      .where({ id: professional_id, role: 'professional' })
      .first()
    if (!professional) {
      return res.status(404).json({ message: 'Professional not found' })
    }

    // Insertar la nueva oferta con estado inicial "pending"
    const [newOffer] = await knex('offers')
      .insert({
        client_id: req.user.id,
        professional_id,
        hourly_rate,
        booked_hours,
        quote,
        scheduled_date,
        status: 'pending', // Estado inicial
        created_at: knex.fn.now(),
        updated_at: knex.fn.now()
      })
      .returning('*')

    res.status(201).json({ message: 'Offer created successfully', offer: newOffer })
  } catch (error) {
    res.status(500).json({ message: 'Error creating offer', error: error.message })
  }
}

/**
 * Lista todas las ofertas activas del cliente autenticado.
 * Se consideran "activas" aquellas ofertas que no estén finalizadas (por ejemplo, status !== 'completed')
 *
 * Endpoint: GET /api/offers/client
 */
exports.listActiveOffersForClient = async (req, res) => {
  try {
    if (req.user.role !== 'client') {
      return res.status(403).json({ message: 'Only clients can access their offers' })
    }

    // Filtrar por ofertas del usuario autenticado y status distinto de 'completed'
    const activeOffers = await knex('offers')
      .where({ client_id: req.user.id })
      .andWhere('status', '<>', 'completed')

    res.json(activeOffers)
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving offers for client', error: error.message })
  }
}

/**
 * Lista las ofertas a las que el profesional está asignado (o postulados).
 * Se mostrarán aquellas ofertas cuyo campo professional_id coincida con el usuario autenticado
 * y que no se encuentren finalizadas (por ejemplo, status !== 'completed').
 *
 * Endpoint: GET /api/offers/professional
 */
exports.listOffersForProfessional = async (req, res) => {
  try {
    if (req.user.role !== 'professional') {
      return res.status(403).json({ message: 'Only professionals can access their offers' })
    }

    const offersForProfessional = await knex('offers')
      .where({ professional_id: req.user.id })
      .andWhere('status', '<>', 'completed')

    res.json(offersForProfessional)
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving offers for professional', error: error.message })
  }
}
