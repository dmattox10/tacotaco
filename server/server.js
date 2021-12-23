import express from "express"
import cors from 'cors'
import helmet from 'helmet'

import { connectDB } from './config/db.js'

import { APP_PORT, APP_NAME } from './env.js'
import { status, errorOut, entry, operation } from './lib/logging.js'
import { populate } from './data/populate.js'


// const statsRouter = require('./routes/statsRouter')
import { tacoRouter } from "./routes/tacoRouter.js"

const app = express()
connectDB() // TODO only if configured to care about Auth and advanced features
populate()

app.use(cors())
app.use(helmet())
app.use(express.json())

// app.use('/stats', statsRouter) // TODO E.T. Phone Home?
app.use('/taco', tacoRouter)

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