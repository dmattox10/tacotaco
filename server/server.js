const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
const morgan = require('morgan')
const bodyParser = require('body-parser')

require('rootpath')()


const { connectDB } = require('config/db.js')

const { APP_PORT, APP_NAME, WHITELIST_URLS } = require('./env')
const { errorOut, operation } = require('lib/logging.js')
const { authRouter } = require('routes/authRouter')
const { tacoRouter } = require('routes/tacoRouter.js')

const app = express()

const jsonParser = bodyParser.json()
const urlencodedParser = bodyParser.urlencoded({ extended: false })

app.use(cors({
  origin: WHITELIST_URLS
}))
app.use(helmet())
app.use(morgan('dev'))
app.use(jsonParser)
app.use(urlencodedParser)

app.use('/v1/taco', tacoRouter)
app.use('/v1/auth', authRouter)

app.get('/', (req, res) => {
    res.send('<h2>“The code is more what you’d call ‘guidelines’ than actual rules.” – Hector Barbossa</h2>')
})
const PORT = APP_PORT || 5050
app.listen(PORT, () => console.log(`'Ello ${APP_NAME}.`))

function handle(signal) {
    errorOut(`=> Received event:`, signal)
 }

 async function closeGracefully(signal) {
    operation(`=> Received signal to terminate:`, signal)
  
    // await db.close() if we have a db connection in this app
    // await other things we should cleanup nicely
    process.exit()
 }

process.on('SIGINT', closeGracefully)
process.on('SIGTERM', closeGracefully)
process.on('SIGHUP', handle)