const { DB_HOST, DB_USER, DB_PASS, DB_NAME } = require('../env.js')
const path = require('path')

const options = {
  client: 'mysql2',
  connection: {
    host: DB_HOST,
    user: DB_USER,
    password: DB_PASS,
    database: DB_NAME
  },
  migrations: {
    tableName: 'knex_migrations'
  }
}

module.exports = {

  development: {
    client: 'sqlite3',
    connection: {
      filename: path.join(__dirname, 'db.sqlite3')
    },
    migrations: {
      tableName: 'knex_migrations'
    },
    useNullAsDefault: true
  },

  staging: {
    options
  },

  production: {
    options
  }

}
