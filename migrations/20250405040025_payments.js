/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.hasTable('payments').then(function (exists) {
    if (!exists) {
      return knex.schema.createTable('payments', function (table) {
        table.bigIncrements('id').primary() // ID autoincremental
        table.bigInteger('offer_id')
          .references('id')
          .inTable('offers')
          .onDelete('CASCADE')
        table.decimal('amount', 10, 2).notNullable() // NUMERIC(10,2)

        // Columnas de texto
        table.text('payment_type').notNullable()
        table.text('status').notNullable()

        // Fecha de pago con zona horaria
        table.timestamp('payment_date', { useTz: true })
          .defaultTo(knex.fn.now())
      }).then(() => {
        // Agregar restricciones CHECK usando knex.raw()
        return knex.raw(`
          ALTER TABLE payments
          ADD CONSTRAINT payment_type_check
          CHECK (payment_type IN ('advance', 'final')),
          ADD CONSTRAINT payment_status_check
          CHECK (status IN ('pending', 'completed', 'failed'))
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
  return knex.schema.hasTable('payments').then(function (exists) {
    if (exists) {
      return knex.schema.dropTable('payments')
    }
    // Añadir este return para cuando la tabla no existe
    return Promise.resolve()
  })
}
