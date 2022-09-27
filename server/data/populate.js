
const { marked } = require('marked')
const fs = require('fs')
const DirectoryTree = require('directory-tree-promise')

const { status, errorOut, entry, operation } = require('../lib/logging')

 // This detects whether or not we need the polyfill
 if (!Object.entries)
 Object.entries = function( obj ){
   var ownProps = Object.keys( obj ),
       i = ownProps.length,
       resArray = new Array(i); // preallocate the Array
   while (i--)
     resArray[i] = [ownProps[i], obj[ownProps[i]]];

   return resArray;
 };

exports.populate = async () => {
    let finalEntries = []
    const tree = await DirectoryTree('../data/tacofancy')
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
                  finalEntries.push(entry)
              }
              
          })
                    
        })
    }
    return finalEntries
}