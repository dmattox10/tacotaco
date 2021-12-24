import mongoose from 'mongoose'

const EntrySchema = new mongoose.Schema({
    category: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    html: {
        type: String,
        required: true
    },
    path: {
        type: String,
        required: true
    },
    likes: {
        type: Object,
        required: false
    }
})

const Entry = mongoose.model('Entry', EntrySchema)

export default Entry