require('dotenv').config()

const {
  APP_NAME,
  APP_PORT,
  DB_HOST,
  DB_USER,
  DB_PASS,
  DB_NAME,
  ENVIRONMENT,
  REFRESH_SECRET,
  SHARED_SECRET,
  USE_AUTH,
  WHITELIST_URLS
} = process.env

const WHITELIST_URLS_LIST = () => {
  if (WHITELIST_URLS) {
    if ([WHITELIST_URLS].length > 1) {
      WHITELIST_URLS_LIST = WHITELIST_URLS.split(',')
    }
    return WHITELIST_URLS
  }
}


module.exports = {
  APP_PORT,
  APP_NAME,
  DB_HOST,
  DB_USER,
  DB_PASS,
  DB_NAME,
  ENVIRONMENT,
  REFRESH_SECRET,
  SHARED_SECRET,
  USE_AUTH,
  WHITELIST_URLS_LIST
}
