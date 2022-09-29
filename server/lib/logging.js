const chalk = require('chalk')

const log = console.log

exports.status = message => {
  log(chalk.blue(message))
}

exports.errorOut = (message, code = 'ERROR') => {
  log(chalk.bgRed.black.bold(` ${code} `) + chalk.bold.red(` ${message}`))
}

exports.entry = message => {
  log(chalk.bgGray.white.bold(' entry ') + chalk.bold.white(` ${message}`))
}

exports.operation = (op, message) => {
  log(chalk.bgGray.white.bold(` ${op} `) + chalk.bold.white(` ${message}`))
}
