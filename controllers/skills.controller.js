const knex = require('../db/knex')

// Obtener todas las habilidades creadas por el usuario autenticado
exports.getAllSkills = async (req, res) => {
  try {
    const userId = req.headers['user-id'] // Suponiendo que el ID del usuario viene en los headers
    if (!userId) {
      return res.status(400).json({ message: 'El ID del usuario es obligatorio' })
    }
    const skills = await knex('skills').where({ created_by: userId }).select('*')
    res.status(200).json(skills)
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener las habilidades', error })
  }
}

// Obtener una habilidad por ID
exports.getSkillById = async (req, res) => {
  try {
    const { id } = req.params
    const skill = await knex('skills').where({ id }).first()
    if (!skill) {
      return res.status(404).json({ message: 'Habilidad no encontrada' })
    }
    res.status(200).json(skill)
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener la habilidad', error })
  }
}

// Crear una nueva habilidad
exports.createSkill = async (req, res) => {
  try {
    const { name, description } = req.body
    const userId = req.headers['user-id'] // Suponiendo que el ID del usuario viene en los headers
    if (!userId) {
      return res.status(400).json({ message: 'El ID del usuario es obligatorio' })
    }
    if (!name) {
      return res.status(400).json({ message: 'El nombre de la habilidad es obligatorio' })
    }
    const [newSkill] = await knex('skills')
      .insert({ name, description, created_by: userId })
      .returning('*')
    res.status(201).json(newSkill)
  } catch (error) {
    res.status(500).json({ message: 'Error al crear la habilidad', error })
  }
}

// Actualizar una habilidad existente (solo si pertenece al usuario autenticado)
exports.updateSkill = async (req, res) => {
  try {
    const { id } = req.params
    const { name, description } = req.body
    const userId = req.headers['user-id']
    if (!userId) {
      return res.status(400).json({ message: 'El ID del usuario es obligatorio' })
    }
    const skill = await knex('skills').where({ id, created_by: userId }).first()
    if (!skill) {
      return res.status(404).json({ message: 'Habilidad no encontrada o no pertenece al usuario' })
    }
    const updatedSkill = await knex('skills')
      .where({ id })
      .update({ name, description })
      .returning('*')
    res.status(200).json(updatedSkill[0])
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar la habilidad', error })
  }
}

// Eliminar una habilidad (solo si pertenece al usuario autenticado)
exports.deleteSkill = async (req, res) => {
  try {
    const { id } = req.params
    const userId = req.headers['user-id']
    if (!userId) {
      return res.status(400).json({ message: 'El ID del usuario es obligatorio' })
    }
    const skill = await knex('skills').where({ id, created_by: userId }).first()
    if (!skill) {
      return res.status(404).json({ message: 'Habilidad no encontrada o no pertenece al usuario' })
    }
    await knex('skills').where({ id }).del()
    res.status(200).json({ message: 'Habilidad eliminada correctamente' })
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar la habilidad', error })
  }
}
