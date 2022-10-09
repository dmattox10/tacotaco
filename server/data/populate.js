
const { marked } = require('marked')
const fs = require('fs')
const DirectoryTree = require('directory-tree-promise')

// This detects whether or not we need the polyfill
if (!Object.entries) {
  Object.entries = function (obj) {
    const ownProps = Object.keys(obj)
    let i = ownProps.length
    const resArray = new Array(i) // preallocate the Array
    while (i--) { resArray[i] = [ownProps[i], obj[ownProps[i]]] }

    return resArray
  }
}

exports.populate = async () => {
  const finalEntries = []
  const tree = await DirectoryTree('../../data/tacofancy') //relative to the seeds function that runs?
  const children = tree.children
  const output = {
    base_layers: [],
    condiments: [],
    mixins: [],
    seasonings: [],
    shells: [],
    full_tacos: []
  }
  const realTacos = children.filter(child => child.name !== 'like_tacos') // No impostors here!
  realTacos.forEach(tacoItem => {
    for (const [key] of Object.entries(output)) {
      if (key === tacoItem.name) {
        output[key].push(tacoItem.children)
      }
    }
  })

  for (const [key] of Object.entries(output)) {
    const itemCategory = key
    const categories = output[key]
    categories.forEach(category => {
      category.forEach(item => {
        if (item.path.split('.').pop() === 'md' && item.path.toLowerCase().indexOf('readme') === -1) { // Markdown only, skip readmes!
          const fileContents = fs.readFileSync(item.path, 'utf8')
          const firstLine = fileContents.split('\n').shift()
          const html = marked.parse(fileContents)
          const entry = {
            category: itemCategory,
            name: firstLine,
            html,
            path: item.path
          }
          finalEntries.push(entry)
        }
      })
    })
  }
  return finalEntries
}
