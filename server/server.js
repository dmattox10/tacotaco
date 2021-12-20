const express = require("express")
const connectDB = require("./config/db")
const cors = require('cors')
const helmet = require('helmet')

const statsRouter = require('./routes/stats')
const app = express()
connectDB()

app.use(express.json())
app.use(cors())
app.use(helmet())

app.use('/stats', statsRouter)

app.get('/', (req, res) => {
    res.send('<h2>“The code is more what you’d call ‘guidelines’ than actual rules.” – Hector Barbossa</h2>')
})
const PORT = 5757 || process.env.PORT
app.listen(PORT, () => console.log(`'Ello ${PORT}.`))