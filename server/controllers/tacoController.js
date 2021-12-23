import { status, errorOut, entry, operation } from '../lib/logging.js'
import Entry from '../models/entry.js'
import Complete from '../models/complete.js'
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

const getRandom = async (req, res) => {
    prepare()
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

const getCustom = async (req, res) => {
    prepare()
    let taco = {}
    for (const [key, value] of Object.entries(req.query)) {
        taco[key] = []
        taco[key].push(noDupes(value, tacoGod[key]))
    }
    res.status(200).json({ taco: taco })
}

const getFull = async (req, res) => {
    const taco = pickRandom(tacoGod.fullTacos)
    res.status(200).json( { taco: taco } )
}

const getComplete = async (req,res) => {
    prepare()
    let output = {}
    let completeTacos = await Complete.find()
    let choice = pickRandom(completeTacos)
    choice.components.forEach(component => {
        Entry.findById({ _id: component.id }, (err, entry) => {
            if (err) {
                errorOut(err)
            } else {
                if (!output[entry.category]) {
                    output[entry.category] = []
                }
                output[entry.category].push(entry)
            }
        })
    })
    for (const [key, value] of Object.entries(choice)) {
        output[key] = [value]
    }
    res.status(200).json({ taco: output })
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

const postFull = async (req, res) => {
    console.log(req.body)
    const { _id, vote } = req.body
    const filter = {
        _id: _id 
    }
    const actionString = `likes.${vote}`
    const update = { $inc: { [actionString] : 1 }}
    Entry.findByIdAndUpdate(filter, update).then(entry => {
        res.status(201).json({ taco: entry })
    })
}

// const postRandom = async (req, res) => {
//     const { ids, vote, name } = req.body
//     const filter = {
//         components: ids
//     }
//     // const actionString = `likes[${vote}]`
//     const actionString = `likes.${vote}`
//     const update = { $inc: { [actionString] : 1 }}
//     Complete.findOneAndUpdate(filter, update).exec(entry => {
//         res.status(201).json({ taco: entry })
//     })
// }

const postCustom = async (req, res) => {
    const { ids, vote, name } = req.body
    const filter = {
        components: ids
    }
    const options = {
        upsert: true
    }
    // const actionString = `likes[${vote}]`
    const actionString = `likes.${vote}`
    const update = { $inc: { [actionString] : 1 }, name: name}
    Complete.findOneAndUpdate(filter, update, options).then(entry => {
        res.status(201).json({ taco: entry })
    })  
}

prepare()

export { getRandom, getCustom, getFull, capabilities, postCustom, postFull, getComplete }