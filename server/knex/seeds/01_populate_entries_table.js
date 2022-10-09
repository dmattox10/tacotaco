const { populate } = require('../../data/populate')

exports.seed = async function (knex) {
  // Deletes ALL existing entries
  await knex('entries').del()
  const finalEntries = await populate()
  finalEntries.forEach(async entry => {
    // await knex('entries').insert(entry)
    await knex('entries').returning('id').insert({
      category: entry.category,
      name: entry.name,
      html: entry.html,
      path: entry.path
    })
  })
}
