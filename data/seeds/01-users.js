/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 * author: Isaac Manríquez
 */
exports.seed = async function (knex) {
  // Deletes ALL existing entries
  await knex.raw('TRUNCATE users RESTART IDENTITY CASCADE')
  await knex('users').insert([
    {
      name: 'Isaac',
      email: 'isaac@correo.com',
      password: '12345',
      role: 'professional'
    },
    {
      name: 'María',
      email: 'maria@correo.com',
      password: 'password1',
      role: 'client'
    },
    {
      name: 'Carlos',
      email: 'carlos@correo.com',
      password: 'password2',
      role: 'professional'
    },
    {
      name: 'Ana',
      email: 'ana@correo.com',
      password: 'password3',
      role: 'client'
    },
    {
      name: 'Luis',
      email: 'luis@correo.com',
      password: 'password4',
      role: 'professional'
    },
    {
      name: 'Sofía',
      email: 'sofia@correo.com',
      password: 'password5',
      role: 'client'
    }
  ])
}
