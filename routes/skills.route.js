const express = require('express')
const router = express.Router()
const skillsController = require('../controllers/skills.controller')

// Middleware para verificar si el usuario es profesional
function isProfessional (req, res, next) {
  const userRole = req.headers.role // Suponiendo que el rol del usuario viene en los headers
  if (userRole === 'professional') {
    return next()
  }
  return res.status(403).json({ message: 'Acceso denegado: Solo los profesionales pueden realizar esta acción.' })
}

// Rutas para el CRUD de skills
router.get('/', skillsController.getAllSkills) // Obtener todas las habilidades
router.get('/:id', skillsController.getSkillById) // Obtener una habilidad por ID
router.post('/', isProfessional, skillsController.createSkill) // Crear una habilidad (solo profesionales)
router.put('/:id', isProfessional, skillsController.updateSkill) // Actualizar una habilidad (solo profesionales)
router.delete('/:id', isProfessional, skillsController.deleteSkill) // Eliminar una habilidad (solo profesionales)

module.exports = router
