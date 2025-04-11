/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.hasTable('users').then(function (exists) {
    if (!exists) {
      return knex.schema.createTable('users', function (table) {
        table.bigIncrements('id').primary()
        table.text('name').notNullable()
        table.text('email').notNullable().unique()
        table.text('password').notNullable()

        // Check constraint mejorado
        table.text('role')
          .notNullable()
          .checkIn(['professional', 'client']) // Versión más moderna

        // Timestamps
        table.timestamp('created_at', { useTz: true })
          .defaultTo(knex.fn.now())

        table.timestamp('updated_at', { useTz: true })
          .defaultTo(knex.fn.now())
      })
    }
    // Añadir este return para casos donde la tabla ya existe
    return Promise.resolve()
  })
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.hasTable('users').then(function (exists) {
    if (exists) {
      return knex.schema.dropTable('users')
    }
    // Añadir este return para casos donde la tabla no existe
    return Promise.resolve()
  })
}
