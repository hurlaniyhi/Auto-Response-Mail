require("./models/Member")
require("./models/Mail")
const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const authRoutes = require("./routes/authRoutes")
const mailRoutes = require("./routes/mailRoutes")
const requireAuth = require("./middlewares/requireAuth")
const cors = require("cors")
var port = process.env.PORT || 8000 

const app = express() 

app.use(
    cors({
        origin: "*",
        methods: "*"
    })
)

app.use(bodyParser.json())
app.use("/",authRoutes) //  the "/" is not necessary
app.use(mailRoutes)


// fintech.request@gmail.com

const mongoUri = "mongodb+srv://Ridwan:Ridko5267$@analytics-app.zsjxk.mongodb.net/<dbname>?retryWrites=true&w=majority"

mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
})

mongoose.connection.on('connected', () => {
    console.log("connected to mongodb cloud")
})

mongoose.connection.on('error', (err) => {
    console.error("Error connecting to mongodb cloud", err)
})

app.get('/',requireAuth, (req, res) => {
    res.send({userId: req.user.email})
})




app.listen(port, ()=>{
    console.log("Listening to port 8000")
})