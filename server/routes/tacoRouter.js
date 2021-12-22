import express from 'express'
import cors from 'cors'
import ExpressBrute from 'express-brute'

import { random, custom, full, capabilities } from '../controllers/tacoController.js'

const store  = new ExpressBrute.MemoryStore()
const bruteforce = new ExpressBrute(store)

const tacoRouter = express.Router()

tacoRouter.get('/random', cors(), bruteforce.prevent, random)
tacoRouter.get('/custom', cors(), bruteforce.prevent, custom)
tacoRouter.get('/full', cors(), bruteforce.prevent, full)
tacoRouter.get('/capabilities', cors(), bruteforce.prevent, capabilities)

export { tacoRouter }

