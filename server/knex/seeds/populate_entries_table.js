const { populate } = require('../../data/populate')

exports.seed = async function (knex) {
  // Deletes ALL existing entries
  await knex('entries').del()
  const finalEntries = await populate()
  finalEntries.forEach(async entry => {
    console.log(entry)
    await knex('entries').insert(entry)
  })
}
