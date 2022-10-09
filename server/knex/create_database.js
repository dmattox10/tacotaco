const Knex = require('knex')
const { DB_HOST, DB_USER, DB_PASS, DB_NAME } = require('../env.js')

const databaseName = DB_NAME || 'tacotaco'

const connection = {
  host: DB_HOST,
  user: DB_USER,
  password: DB_PASS
}

async function main() {
  let knex = Knex({
    client: 'mysql',
    connection
  })
  
  await knex.raw('CREATE DATABASE IF NOT EXISTS ??', databaseName)
  
  knex = Knex({
    client: 'mysql',
    connection: {
      ...connection,
      database: databaseName,
    }
  })
}

main().catch(console.log).then(process.exit)