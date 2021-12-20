const readMarkdown = require('read-markdown')
const path = require('path')
const fs = require('fs')
const { status, errorOut, entry, operation } = require('../lib/logging')

export function populate() {
    const directoryPath = path.join(__dirname, 'tacofancy')

    fs.readdir(directoryPath, function (err, files) {
        
        if (err) {
            return console.log('Unable to scan directory: ' + err)
        } 
        files.forEach(function (file) {
    
            console.log(file);
        })
    })
}