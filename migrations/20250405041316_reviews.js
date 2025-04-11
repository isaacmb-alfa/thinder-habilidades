/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.hasTable('reviews').then(function (exists) {
    if (!exists) {
      return knex.schema.createTable('reviews', (table) => {
        table.bigIncrements('id').primary() // ID autoincremental
        table.bigInteger('offer_id')
          .references('id')
          .inTable('offers')
          .onDelete('CASCADE')
        table.integer('rating').notNullable() // Columna de calificación
        table.text('comment') // Columna opcional
        table.timestamp('created_at', { useTz: true })
          .defaultTo(knex.fn.now())
      }).then(() => {
        // Agregar la restricción CHECK para rating usando knex.raw()
        return knex.raw(`
          ALTER TABLE reviews
          ADD CONSTRAINT rating_check
          CHECK (rating BETWEEN 1 AND 5)
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
  return knex.schema.hasTable('reviews').then(function (exists) {
    if (exists) {
      return knex.schema.dropTable('reviews')
    }
    // Añadir este return para cuando la tabla no existe
    return Promise.resolve()
  })
}
