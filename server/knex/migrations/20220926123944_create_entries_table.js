exports.up = function (knex, Promise) {
  return knex.schema.createTable('entries', table => {
    table.increments('id').primary().notNullable()
    table.string('name').unique().notNullable()
    table.string('category').notNullable()
    table.string('path').notNullable()
    table.string('html', 22484).notNullable()
    table.json('likes')
    table.timestamps(true, true)
  })
}

exports.down = function (knex, Promise) {
  return knex.schema.dropTable('entries')
}
