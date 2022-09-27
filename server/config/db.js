// import mongoose from "mongoose"

// import { MONGO_URI } from '../env.js'

// const connectDB = () => {
//     connectWithRetry()
// }

// const connectWithRetry = async () => {
//     return await mongoose.connect(MONGO_URI(), err => {
//         if (err) {
//             console.error('Failed to connect on startup = retrying in 1 second', err)
//             setTimeout(connectWithRetry, 1000)
//         }
//         console.log("Connected to DB")
//         // sync(status => console.log(status))
//     })
// }

// export { connectDB } 