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

const noDupes = (items, output) => {
    const item = items[Math.floor(Math.random()*items.length)]
    if (output.indexOf(item) === -1) {
        output.push(item)
        return output
    } else {
        return noDupes(items, output)
    }
}

const custom = async (req, res) => {
    let taco = {}
    for (const [key, value] of Object.entries(req.query)) {
        while (taco[key].length -1 < value) {
            taco[key].push()
        }
    }

    res.status(200).json( { message: 'hi' } )
}

const full = async (req, res) => {
    const taco = pickRandom(tacoGod.fullTacos)
    res.status(200).json( { tacos: taco } )
}

prepare()

export { random, custom, full }