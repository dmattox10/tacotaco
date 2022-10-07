const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
const morgan = require('morgan')
const bodyParser = require('body-parser')
const path = require('path')

require('rootpath')()

const { APP_PORT, WHITELIST_URLS_LIST, ENVIRONMENT } = require('./env')
const { errorOut, operation } = require('lib/logging')
const { tacoRouter } = require('routes/tacoRouter')
const { prepare } = require('./controllers/tacoController')
const { development } = require('./knex/knexfile')
const app = express()

const jsonParser = bodyParser.json()
const urlencodedParser = bodyParser.urlencoded({ extended: false })

if (!Object.entries) {
  Object.entries = function (obj) {
    const ownProps = Object.keys(obj)
    let i = ownProps.length
    const resArray = new Array(i) // preallocate the Array
    while (i--) { resArray[i] = [ownProps[i], obj[ownProps[i]]] }

    return resArray
  }
}

const getCount = async () => {
  const tacoGod = await prepare()
  const response = {}
  for (const [key, value] of Object.entries(tacoGod)) {
    response[key] = value.length
  }
  console.log(response)
  return response
}

if (ENVIRONMENT !== "development") {
  app.use(cors({
    origin: WHITELIST_URLS_LIST
  }))
}

app.use(helmet())
app.use(morgan('dev'))
app.use(jsonParser)
app.use(urlencodedParser)

app.use('/public', express.static(path.join(__dirname + '/public')))


app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
app.set('views', __dirname)

app.use('/', async (req, res, next) => {
  const count = await getCount()
  res.render('views/index.ejs', { count })
  next()
})
app.use('/v1/taco', tacoRouter)

// app.get('/', (req, res) => {
//   res.send('<h2>“The code is more what you’d call ‘guidelines’ than actual rules.” – Hector Barbossa</h2>')
// })

const PORT = APP_PORT || 5050
app.listen(PORT, () => console.log(`'Ello ${APP_PORT}.`))

// app.get('/', async (req, res) => {
//   const count = await getCount()
//   console.log(count)
//   res.render('index', { fields: count })
// })

function handle (signal) {
  errorOut('=> Received event:', signal)
}

async function closeGracefully (signal) {
  operation('=> Received signal to terminate:', signal)

  // await db.close() if we have a db connection in this app
  // await other things we should cleanup nicely
  process.exit()
}

process.on('SIGINT', closeGracefully)
process.on('SIGTERM', closeGracefully)
process.on('SIGHUP', handle)
