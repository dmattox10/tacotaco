exports.up = function (knex, Promise) {
    return knex.schema.createTable('recipes', table => {
      table.increments('id').primary().notNullable()
      table.string('name').unique().notNullable()
      table.json('likes').notNullable()
      table.specificType('components', 'text ARRAY').notNullable()
      table.timestamps(true, true)
    })
  }
  
  exports.down = function (knex, Promise) {
    return knex.schema.dropTable('recipes')
  }
  