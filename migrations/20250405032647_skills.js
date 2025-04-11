/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.hasTable('skills').then(function (exists) {
    if (!exists) {
      return knex.schema.createTable('skills', function (table) {
        table.bigIncrements('id').primary() // BIGINT generado automáticamente como identidad
        table.text('name').notNullable()
        table.text('description')
        table.bigInteger('created_by') // Relación con el usuario que creó la habilidad
          .references('id')
          .inTable('users')
          .onDelete('CASCADE')
          .notNullable()
      })
    }
  })
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTable('skills')
}
