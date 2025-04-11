/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.hasTable('notifications').then(function (exists) {
    if (!exists) {
      return knex.schema.createTable('notifications', (table) => {
        table.bigIncrements('id').primary() // ID autoincremental
        table.bigInteger('user_id')
          .references('id')
          .inTable('users')
          .onDelete('CASCADE')
        table.text('message').notNullable()
        table.timestamp('notification_date', { useTz: true })
          .defaultTo(knex.fn.now())
        table.boolean('is_read')
          .defaultTo(false)
      })
    }
  })
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.hasTable('notifications').then(function (exists) {
    if (exists) {
      return knex.schema.dropTable('notifications')
    }
  })
}
