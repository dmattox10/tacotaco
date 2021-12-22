import express from 'express'
import cors from 'cors'
import ExpressBrute from 'express-brute'
import { checkAuth } from '../middlewares.js'

import { getRandom, getCustom, getFull, capabilities, postCustom, postFull, getComplete } from '../controllers/tacoController.js'

const store  = new ExpressBrute.MemoryStore()
const bruteforce = new ExpressBrute(store)

const tacoRouter = express.Router()

tacoRouter.get('/random', cors(), bruteforce.prevent, getRandom)
tacoRouter.get('/custom', cors(), bruteforce.prevent, getCustom)
tacoRouter.get('/full', cors(), bruteforce.prevent, getFull) 
tacoRouter.get('/complete', cors(), bruteforce.prevent, getComplete)
tacoRouter.get('/capabilities', cors(), bruteforce.prevent, capabilities)

tacoRouter.post('/custom', cors(), checkAuth, bruteforce.prevent, postCustom)
tacoRouter.post('/full', cors(), checkAuth, bruteforce.prevent, postFull)

export { tacoRouter }

