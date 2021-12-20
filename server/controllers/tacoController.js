import mongoose from 'mongoose'
import { status, errorOut, entry, operation } from '../lib/logging.js'
import Entry from '../models/entry.js'

let baseLayers, condiments, mixins, seasonings, shells, fullTacos = []

const prepare = async () => {
    baseLayers = await Entry.find( {category: 'base_layers'} )
    condiments = await Entry.find( {category: 'condiments'} ) 
    mixins = await Entry.find( {category: 'mixins'} )
    seasonings = await Entry.find( {category: 'seasonings'} )
    shells = await Entry.find( {category: 'shells'} )
    fullTacos = await Entry.find( {category: 'full_tacos'} )
}


const random = async (req, res) => {
    res.status(200).json( { message: 'hi' } )
}

const custom = async (req, res) => {
    res.status(200).json( { message: 'hi' } )
}

const full = async (req, res) => {
    res.status(200).json( { message: 'hi' } )
}

prepare()

export { random, custom, full }