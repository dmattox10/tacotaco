const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
const morgan = require('morgan')
const bodyParser = require('body-parser')
const path = require('path')

require('rootpath')()

const { APP_PORT } = require('./env')
const { errorOut, operation } = require('lib/logging')
const { tacoRouter } = require('routes/tacoRouter')
const { prepare } = require('./controllers/tacoController')
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

app.use(helmet())
app.use(morgan('dev'))
app.use(jsonParser)
app.use(urlencodedParser)

app.use(express.static(__dirname + '/public/'))
app.use(express.static(__dirname + '/views/'))

app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

app.use('/', async (req, res, next) => {
  const count = await getCount()
  return res.render('/views/index.ejs', { count })
})

app.use('/v1/taco', tacoRouter)

const PORT = APP_PORT || 5050
app.listen(PORT, () => console.log(`'Ello ${APP_PORT}.`))

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
