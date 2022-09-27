const express = require('express')
const ExpressBrute = require('express-brute')

const { byPassAuth, checkAuth } = require('../middlewares.js')
const { BYPASS_SECRET, USE_AUTH } = require('../env.js')

const { getRandom, getCustom, getFull, capabilities, postCustom, postFull, getComplete } = require('../controllers/tacoController.js')

const store  = new ExpressBrute.MemoryStore()
const bruteforce = new ExpressBrute(store)

const tacoRouter = express.Router()

// This defaults to checkAuth in case of null or anything else, must be set to false in order to bypass, as well as setting a bypass secret
const authMethod = () => {
    if (BYPASS_SECRET && USE_AUTH === false) {
        return byPassAuth
    }
    return checkAuth
}

tacoRouter.get('/random', bruteforce.prevent,getRandom)
tacoRouter.get('/custom', bruteforce.prevent, getCustom)
tacoRouter.get('/full', bruteforce.prevent, getFull) 
tacoRouter.get('/complete', bruteforce.prevent, getComplete)
tacoRouter.get('/capabilities', bruteforce.prevent, capabilities)

// tacoRouter.post('/custom', bruteforce.prevent, authMethod(), postCustom)
// tacoRouter.post('/full', bruteforce.prevent, authMethod(), postFull)

tacoRouter.post('/custom', bruteforce.prevent, postCustom)
tacoRouter.post('/full', bruteforce.prevent, postFull)

module.exports = { tacoRouter }

