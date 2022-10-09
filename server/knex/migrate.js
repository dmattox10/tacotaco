const Knex = require('knex')
const { DB_HOST, DB_USER, DB_PASS, DB_NAME, APP_NAME } = require('../env.js')

// You can dynamically pass the database name
// as a command-line argument, or obtain it from
// a .env file
const databaseName = DB_NAME || tacotaco

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
  
  // Lets create our database if it does not exist
  await knex.raw('CREATE DATABASE IF NOT EXISTS ??', databaseName)
  

  // Now that our database is known, let's create another knex object
  // with database name specified so that we can run our migrations
  knex = Knex({
    client: 'mysql',
    connection: {
      ...connection,
      database: databaseName,
    }
  })

  // Now we can happily run our migrations
  await knex.migrate.latest()

  await knex.seed.run()
  // Done!!
  
}

main().catch(console.log).then(process.exit)
