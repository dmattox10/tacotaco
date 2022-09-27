const { populate } = require('../../data/populate')

exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('entries').del()
  let finalEntries = await populate()
  await knex('entries').insert([
    ...finalEntries
  ]);
};
