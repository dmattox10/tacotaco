// import { status, errorOut, entry, operation } from '../lib/logging.js'
// import Entry from '../models/entry.js'
// import Complete from '../models/complete.js'
const _ = require('lodash')
const cuid = require('cuid')
const knex = require('../knex/knex')
// import mongoose from 'mongoose'

const tacoGod = {}

const prepare = async () => {

    const [baseLayers] = await knex
      .table('entries')
      .where({category: 'base_layers'})
    const [condiments] = await knex
      .table('entries')
      .where({category: 'base_layers'})
    const [mixins] = await knex
      .table('entries')
      .where({category: 'base_layers'})
    const [seasonings] = await knex
      .table('entries')
      .where({category: 'base_layers'})
    const [shells] = await knex
      .table('entries')
      .where({category: 'base_layers'})
    tacoGod.baseLayers = baseLayers
    tacoGod.condiments = condiments
    tacoGod.mixins = mixins
    tacoGod.seasonings = seasonings
    tacoGod.shells = shells

    return tacoGod
}

const pickRandom = (items) => {
    const item = items[Math.floor(Math.random()*items.length)]
    return item
}

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
    const tacoGod = await prepare()
    let taco = {}
    for (const [key, value] of Object.entries(req.query)) {
        taco[key] = []
        taco[key].push(noDupes(value, tacoGod[key]))
    }
    res.status(200).json({ taco: taco })
}

const getFull = async (req, res) => {
    const { id } = req.query
    if (id) {
        const ObjectId = mongoose.Types.ObjectId
        try {
            let validId = ObjectId(id)
            await Entry.findOne({ id: validId }).then(entry => {
                if (entry) {
                    res.status(200).json({ taco: entry })
                } else {
                    res.status(404).json({ error: 'no bueno.' })
                }
            })
        } catch (InvalidObjectIdException) {
            errorOut('invalid object ID')
        }
    }
    const taco = pickRandom(tacoGod.fullTacos)
    res.status(200).json( { taco: taco } )
}

const getComplete = async (req,res) => {
    const { id } = req.query
    let output = {}
    if (id) {
        const ObjectId = mongoose.Types.ObjectId
        try {
            let validId = ObjectId(id)
            await Complete.findOne({ id: validId }).then(taco => {
                if (taco) {
                    output._id = taco._id
                    output.likes = taco.likes
                    taco.components.forEach(component => {
                        try {
                            let componentId = ObjectId(component)
                            Entry.findOne({ id: componentId }).then(entry => {
                                if (entry) {
                                    status(entry)
                                    if (!output[entry.category]) {
                                        output[entry.category] = []
                                    }
                                    output[entry.category].push(entry)
                                }
                            })
                        } catch (InvalidObjectIdException) {
                            errorOut('invalid object ID')
                        } 
                    })
                    // for (const [key, value] of Object.entries(taco)) {
                    //     output[key] = [value]
                    // }
                } else {
                    res.status(404).json({ error: 'no bueno.' })
                }
            })
        } catch (InvalidObjectIdException) {
            errorOut('invalid object ID')
        } 
    } else { // send random taco
        prepare()
        let completeTacos = await Complete.find()
        let choice = pickRandom(completeTacos)
        // choice.components.forEach(component => {
        //     status(component)
        //     Entry.findOne({ id: component }, (err, entry) => {
        //         status(entry)
        //         if (err) {
        //             errorOut(err)
        //             res.status(500).json({ error: 'sorry.'})
        //         } else {
        //             if (!output[entry.category]) {
        //                 output[entry.category] = []
        //             }
        //             output[entry.category].push(entry)
        //         }
        //     })
        // })
        // model.find({
        //     '_id': { $in: [
        //         mongoose.Types.ObjectId('4ed3ede8844f0f351100000c'),
        //         mongoose.Types.ObjectId('4ed3f117a844e0471100000d'), 
        //         mongoose.Types.ObjectId('4ed3f18132f50c491100000e')
        //     ]}
        // }, function(err, docs){
        //      console.log(docs);
        // });
        let filter = {
            _id: {
                $in: choice.components
            }
        }
        Entry.find(filter).then(components => {
            if (components) {
                components.forEach(component => status(component))
                output.components = components
                output._id = choice._id
                output.likes = choice.likes
                output.name = choice.name
                res.status(200).json({ taco: output })
            }
        })
        // let components = choice.components.map(component => {
        //     Entry.find({ id: component }).then(entries => {
        //         if (entries) {
        //             entries.forEach(entry => status(entry))

        //         }
        //     })
        // })
        // for (const [key, value] of Object.entries(choice)) {
        //     output[key] = [value]
        // }
    }
}

const capabilities = async (req, res) => {
    let quantities = {}
    let uid = cuid()
    const tacoGod = await prepare()
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
    const { id, vote } = req.body
    const ObjectId = mongoose.Types.ObjectId
    try {
        let fullId = ObjectId(id)
        const filter = {
            id: fullId
        }
        const actionString = `likes.${vote}`
        const update = { $inc: { [actionString] : 1 }}
        Entry.findOneAndUpdate(filter, update).then(entry => {
            res.status(201).json({ taco: entry })
        })
    } catch (InvalidObjectIdException) {
        errorOut('invalid object ID')
    } 
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
    const { id, ids, vote, name } = req.body
    let filter = {}
    let update = {}
    const ObjectId = mongoose.Types.ObjectId
    try {
        let customId = ObjectId(id)
        if (id) {
            filter.id = customId
        } else {
            filter.components = ids
            update.name = name
        }
        const options = {
            upsert: true,
            new: true
        }
        // const actionString = `likes[${vote}]`
        const actionString = `likes.${vote}`
        update.$inc = { [actionString] : 1 }
        // const update = { $inc: { [actionString] : 1 }}
        Complete.findOneAndUpdate(filter, update, options).then(entry => {
            res.status(201).json({ taco: entry }) 
        })  
    } catch (InvalidObjectIdException) {
        errorOut('invalid object ID')
    } 
}

prepare()

module.exports = { getRandom, getCustom, getFull, capabilities, postCustom, postFull, getComplete }