import mongoose from 'mongoose'
import { status, errorOut, entry, operation } from '../lib/logging.js'
import Entry from '../models/entry.js'

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
    const base = pickRandom(tacoGod.baseLayers)
    const condiment = pickRandom(tacoGod.condiments)
    const mixin = pickRandom(tacoGod.mixins)
    const seasoning = pickRandom(tacoGod.seasonings)
    const shell = pickRandom(tacoGod.shells)
    const taco = {
        bases: [base],
        condiments: [condiment],
        mixins: [mixin],
        seasonings: [seasoning],
        shells: [shell]
    }
    res.status(200).json( { taco: taco } )
}

function noDupes(items, output) {
    const item = pickRandom(items)
    if (output.indexOf(item) === -1) {
        output.push(item)
        return output
    } else {
        return noDupes(items, output)
    }
}

const result = [];
const map = new Map();
for (const item of array) {
    if(!map.has(item.id)){
        map.set(item.id, true);    // set any value to Map
        result.push({
            id: item.id,
            name: item.name
        });
   }
}

const custom = async (req, res) => {
    let taco = {}
    for (const [key, value] of Object.entries(req.query)) {
        taco[key] = []
        while (taco[key].length -1 < value) {
            let item = noDupes(tacoGod[key], taco[key] = [])
            taco[key].push(item)
        }
    }
    res.status(200).json( { taco: taco } )
}

const full = async (req, res) => {
    const taco = pickRandom(tacoGod.fullTacos)
    res.status(200).json( { taco: taco } )
}

prepare()

export { random, custom, full }