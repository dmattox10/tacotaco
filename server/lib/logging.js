import chalk from 'chalk'

const log = console.log

const status = message => {
    log(chalk.blue(message))
}

const errorOut = (code='ERROR', message) => {
    log(chalk.bgRed.black.bold(` ${code} `) + chalk.bold.red(` ${message}`))
}

const entry = message => {
    log(chalk.bgGray.white.bold(' entry ') + chalk.bold.white(` ${message}`))
}

const operation = (op, message) => {
    log(chalk.bgGray.white.bold(` ${op} `) + chalk.bold.white(` ${message}`))
}

export { status, errorOut, entry, operation }