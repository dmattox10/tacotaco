const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
const morgan = require('morgan')
const bodyParser = require('body-parser')
const path = require('path')

require('rootpath')()

const { APP_PORT, APP_NAME, WHITELIST_URLS_LIST } = require('./env')
const { errorOut, operation } = require('lib/logging')
const { tacoRouter } = require('routes/tacoRouter')
const { populate } = require('./controllers/tacoController')
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
  const tacoGod = await populate()
  const response = {}
  for (const [key, value] of Object.entries(tacoGod)) {
    response.push({[key]: value.length})
  }
  return response
}

app.use(cors({
  origin: WHITELIST_URLS_LIST
}))
app.use(helmet())
app.use(morgan('dev'))
app.use(jsonParser)
app.use(urlencodedParser)
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));
app.set('view engine', 'pug');

app.use('/v1/taco', tacoRouter)

// app.get('/', (req, res) => {
//   res.send('<h2>“The code is more what you’d call ‘guidelines’ than actual rules.” – Hector Barbossa</h2>')
// })



const PORT = APP_PORT || 5050
app.listen(PORT, () => console.log(`'Ello ${APP_PORT}.`))

app.get('/', async (req, res) => {
  const count = await getCount()
  res.render('index', { fields: count })
})

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
