import { marked } from 'marked'
import mongoose from 'mongoose'
import fs from 'fs'
import { status, errorOut, entry, operation } from '../lib/logging.js'
import DirectoryTree from 'directory-tree'

import Entry from '../models/entry.js'

const store = async (entry, options) => {
    const filter = { html: entry.html}
    Entry.findOneAndUpdate(filter, entry, options).then(record => {
        operation('=> Database: ', record)
    })
}

export function populate() {
    const tree = DirectoryTree('./data/tacofancy/')
    const children = tree.children
    let output = {
        base_layers: [],
        condiments: [],
        mixins: [],
        seasonings: [],
        shells: [],
        full_tacos: []}
    let realTacos = children.filter(child => child.name !== 'like_tacos') // No impostors here!
    realTacos.forEach(tacoItem => {
        for (const [key] of Object.entries(output)) {
            if (key === tacoItem.name) {
                output[key].push(tacoItem.children) 
            }
        }
    })
    for (const [key] of Object.entries(output)) {
        let itemCategory = key
        let categories = output[key]
        categories.forEach(category => {
            category.forEach(item => {
                if (item.path.split('.').pop() === 'md' && item.path.toLowerCase().indexOf('readme') === -1) { // Markdown only, skip readmes!
                    const fileContents = fs.readFileSync(item.path, 'utf8')
                    const firstLine = fileContents.split('\n').shift()
                    const html = marked.parse(fileContents)
                    let entry = {
                        category: itemCategory,
                        name: firstLine,
                        html: html,
                        path: item.path
                    }
                    let options = {
                        upsert: true,
                        new: true
                    }
                    store(entry, options)
                }
                
            })
                    
        })
    }
}