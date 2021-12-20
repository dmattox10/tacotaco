const mongoose = require('mongoose')
const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')
const adapter = new FileSync('db.json')
const db = low(adapter)

require('dotenv').config()

// TODO Make it keep trying to reconnect!

if (!db.has('visits').value()) {
    db.defaults({ visits: 0 })
    .write()
}

const dbURI = process.env.MONGO_URI || 'mongodb://localhost:27017/PROJECTNAME'

const connectDB = async () => {
    try {
        await mongoose.connect(dbURI)
        console.log('Connected to DB')
    }
    catch (err) {
        console.error(err.message)
    }
}

module.exports = connectDB