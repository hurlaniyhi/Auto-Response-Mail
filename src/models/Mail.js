const mongoose = require('mongoose')





const mailSchema = new mongoose.Schema({
    mailType: {
        type: String,
        required: true
    },
    sender: {
        type: String,
        required: true  // incase if someone did not provide a name, it will automatically give it default value of empty string
    },
    date: {
        type: String,
        required: true
    },
    time: {
        type: String,
        required: true
    },
    receiverEmail: {
        type: String,
        required: true
    },
    receiverName: {
        type: String,
        required: true
    } 
   
})


mongoose.model('Mail', mailSchema)
//we are not going to load up the pointSchema because we dont want to tie our pointSChema with mongoose
// because we are not going to have a collection of pointSchemas.
// all the objects(pointSchema will be embedded inside the trackSchema)