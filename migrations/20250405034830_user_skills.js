/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable('user_skills', function (table) {
    // Claves foráneas con CASCADE
    table.bigInteger('user_id')
      .references('id')
      .inTable('users')
      .onDelete('CASCADE')

    table.bigInteger('skill_id')
      .references('id')
      .inTable('skills')
      .onDelete('CASCADE')

    // Clave primaria compuesta
    table.primary(['user_id', 'skill_id'])
  })
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.hasTable('user_skills').then(function (exists) {
    if (exists) {
      return knex.schema.dropTable('user_skills')
    }
  })
}
