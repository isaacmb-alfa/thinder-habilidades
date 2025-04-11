/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.hasTable('offers').then(function (exists) {
    if (!exists) {
      return knex.schema.createTable('offers', function (table) {
        table.bigIncrements('id').primary()
        table.bigInteger('client_id')
          .references('id')
          .inTable('users')
          .onDelete('CASCADE')
        table.bigInteger('professional_id')
          .references('id')
          .inTable('users')
          .onDelete('CASCADE')
        table.decimal('hourly_rate', 10, 2).notNullable()
        table.integer('booked_hours').notNullable()

        // Restricción de check usando knex.raw
        table.text('status').notNullable()
        table.text('quote')
        table.timestamp('scheduled_date', { useTz: true }).notNullable()

        table.timestamp('created_at', { useTz: true })
          .defaultTo(knex.fn.now())
        table.timestamp('updated_at', { useTz: true })
          .defaultTo(knex.fn.now())
      }).then(() => {
        // Agregar la restricción de check después de crear la tabla
        return knex.raw(`
          ALTER TABLE offers
          ADD CONSTRAINT status_check
          CHECK (status IN ('pending', 'in_progress', 'completed', 'cancelled'))
        `)
      })
    }
    // Añadir este return para cuando la tabla ya existe
    return Promise.resolve()
  })
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.hasTable('offers').then(function (exists) {
    if (exists) {
      return knex.schema.dropTable('offers')
    }
    // Añadir este return para cuando la tabla no existe
    return Promise.resolve()
  })
}
