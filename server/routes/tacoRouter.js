import express from 'express'
import cors from 'cors'
import ExpressBrute from 'express-brute'
import { checkAuth, bypassAuth } from '../middlewares.js'

import { getRandom, getCustom, getFull, capabilities, postCustom, postFull, getComplete } from '../controllers/tacoController.js'

const store  = new ExpressBrute.MemoryStore()
const bruteforce = new ExpressBrute(store)

const tacoRouter = express.Router()

tacoRouter.get('/random', cors(), getRandom)
tacoRouter.get('/custom', cors(), getCustom)
tacoRouter.get('/full', cors(), getFull) 
tacoRouter.get('/complete', cors(), getComplete)
tacoRouter.get('/capabilities', cors(), capabilities)

tacoRouter.post('/custom', cors(), bypassAuth, postCustom)
tacoRouter.post('/full', cors(), bypassAuth, postFull)

export { tacoRouter }

