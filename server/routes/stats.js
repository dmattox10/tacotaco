const express = require('express')
const Cors = require('cors')
const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')
const adapter = new FileSync('db.json')
const db = low(adapter)

const statsRouter = express.Router()

statsRouter.get('/', Cors(), async (req, res) => {
    db.update('visits', n => n + 1)
    .write()

    const visitors = db.get('visits').value()

    res.status(200).json({
        visits: visitors
    })
})