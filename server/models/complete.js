import mongoose from 'mongoose'

const CompleteSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    likes: {
        type: Object,
        required: false
    },
    components: {
        type: Array,
        required: true
    }
})

const Complete = mongoose.model('Complete', CompleteSchema)

export default Complete