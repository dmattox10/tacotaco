require('dotenv').config()

const {
  APP_NAME,
  APP_PORT,
  DB_HOST,
  DB_USER,
  DB_PASS,
  DB_NAME,
  ENVIRONMENT,
} = process.env

module.exports = {
  APP_PORT,
  APP_NAME,
  DB_HOST,
  DB_USER,
  DB_PASS,
  DB_NAME,
  ENVIRONMENT
}
