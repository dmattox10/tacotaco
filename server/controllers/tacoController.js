import { status, errorOut, entry, operation } from '../lib/logging.js'
import Entry from '../models/entry.js'
import _ from 'lodash'
import cuid from 'cuid'

let tacoGod = {}

const prepare = async () => {
    tacoGod.baseLayers = await Entry.find( {category: 'base_layers'} ),
    tacoGod.condiments = await Entry.find( {category: 'condiments'} ), 
    tacoGod.mixins = await Entry.find( {category: 'mixins'} ),
    tacoGod.seasonings = await Entry.find( {category: 'seasonings'} ),
    tacoGod.shells = await Entry.find( {category: 'shells'} ),
    tacoGod.fullTacos = await Entry.find( {category: 'full_tacos'} )
}

const pickRandom = (items) => {
    const item = items[Math.floor(Math.random()*items.length)]
    return item
}

const random = async (req, res) => {
    let taco = {}
    for (const [key] of Object.entries(tacoGod)) {
        taco[key] = []
        let item = pickRandom(tacoGod[key])
        taco[key].push(item)
    }
    res.status(200).json({ taco: taco })
    
}

function noDupes(numItems, items) {
    const indices = [...Array(items.length).keys()]
    const shuffledIndices = _.shuffle(indices)
    let output = []
    for (let i = 0; i < numItems - 1; i++) {
        output.push(items[shuffledIndices.pop()])
    }
    return output
    
}

const custom = async (req, res) => {
    let taco = {}
    for (const [key, value] of Object.entries(req.query)) {
        taco[key] = []
        taco[key].push(noDupes(value, tacoGod[key]))
    }
    res.status(200).json({ taco: taco })
}

const full = async (req, res) => {
    const taco = pickRandom(tacoGod.fullTacos)
    res.status(200).json( { taco: taco } )
}

const capabilities = async (req, res) => {
    let quantities = {}
    let uid = cuid()
    for (const [key] of Object.entries(tacoGod)) {
        quantities[key] = tacoGod[key].length
    }
    let data = {
        uid: uid,
        quantities, quantities
    }
    res.status(200).json({ server: data })
}

prepare()

export { random, custom, full, capabilities }