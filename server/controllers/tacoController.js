// import { status, errorOut, entry, operation } from '../lib/logging.js'
// import Entry from '../models/entry.js'
// import Complete from '../models/complete.js'
const _ = require('lodash')
const knex = require('../knex/knex')
const { errorOut } = require('../lib/logging')
// import mongoose from 'mongoose'

const tacoGod = {}
// Gets each category out of the DB and ready to send
const prepare = async () => {

    const baseLayers = await knex
      .table('entries')
      .where({category: 'base_layers'})
    const condiments = await knex
      .table('entries')
      .where({category: 'condiments'})
    const mixins = await knex
      .table('entries')
      .where({category: 'mixins'})
    const seasonings = await knex
      .table('entries')
      .where({category: 'seasonings'})
    const shells = await knex
      .table('entries')
      .where({category: 'shells'})
    tacoGod.baseLayers = baseLayers
    tacoGod.condiments = condiments
    tacoGod.mixins = mixins
    tacoGod.seasonings = seasonings
    tacoGod.shells = shells

    return tacoGod
}

// Chooses a random item out of an array and returns only the item chosen
const pickRandom = (items) => {
    const item = items[Math.floor(Math.random()*items.length)]
    return item
}

// GET route returning a taco containing one random item from each category
const getRandom = async (req, res) => {
    const tacoGod = await prepare()
    let taco = {}
    for (const [key] of Object.entries(tacoGod)) {
        if (key !== 'fullTacos') {
            taco[key] = []
            let item = pickRandom(tacoGod[key])
            taco[key].push(item)
        }
    }
    res.status(200).json({ taco: taco })
}

// At the end of mixing things up, remove and REPLACE any duplicates
function noDupes(numItems, items) {
    const indices = [...Array(items.length).keys()]
    const shuffledIndices = _.shuffle(indices)
    let output = []
    for (let i = 0; i < numItems; i++) {
        output.push(items[shuffledIndices.pop()])
    }
    return output
    
}

// GET a randomly generated taco with ?key=value options on it
const getCustom = async (req, res) => {
    const tacoGod = await prepare()
    let taco = {}
    for (const [key, value] of Object.entries(req.query)) {
        taco[key] = []
        taco[key].push(noDupes(value, tacoGod[key]))
    }
    res.status(200).json({ taco: taco })
}

const getComplete = async (req, res) => {
    const { id } = req.query

    const populateTacosList = async () => {
        const tacosList = await knex
            .table('entries')
            .where({ category: 'full_tacos'})
        return tacosList
        }
    
    let tacos = []
    switch(id) {
        case 'ALL':
            tacos = await populateTacosList()
            res.status(200).json({ tacos: tacos })
            break;
        // May need changed to null
        case undefined:
            tacos = await populateTacosList()
            let taco = pickRandom(tacos)
            res.status(200).json({ tacos: tacos })
            break;

        default:
            try {
                const taco = await knex
                  .table('entries')
                  .where({ id: id, category: 'full_tacos' })
                if (taco) {
                    res.status(200).json({ tacos: tacos })
                }
                return res.status(404)
            }
            catch (error) {
                errorOut(error.message)
                res.status(500).json({ error: error.message })
            }
    }
}  

module.exports = { getRandom, getCustom, getComplete }