/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function (knex) {
  // Deletes ALL existing entries
  await knex.raw('TRUNCATE skills RESTART IDENTITY CASCADE')
  await knex('skills').insert([
    {
      name: 'fotografía',
      description: 'Fotografía de eventos y retratos',
      created_by: 1 // ID del usuario que creó esta habilidad
    },
    {
      name: 'desarrollo web',
      description: 'Creación y mantenimiento de sitios web',
      created_by: 2
    },
    {
      name: 'diseño gráfico',
      description: 'Diseño de logotipos, banners y material publicitario',
      created_by: 1
    },
    {
      name: 'traducción',
      description: 'Traducción de documentos en varios idiomas',
      created_by: 3
    },
    {
      name: 'redacción',
      description: 'Creación de contenido escrito para blogs y redes sociales',
      created_by: 2
    }
  ])
}
