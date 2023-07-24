const express = require('express')
const cors = require('cors')
const app = express()

app.use(express.json())
app.use(cors())
const PORT = 5000
app.listen(PORT, () => {
    console.log(`Server is running on PORT ${PORT}...`)
})

const mongoose = require('mongoose')
mongoose.connect('mongodb://0.0.0.0:27017/K-HUB',{
    useNewUrlParser: true,
     useUnifiedTopology: true,
}).then(()=>{
    console.log("database connected")
})


