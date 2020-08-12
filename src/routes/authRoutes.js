const express = require("express")
const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const Member = mongoose.model('Member')
const requireAuth = require('../middlewares/requireAuth')


const router = express.Router()


router.post("/signup", async(req,res) => {
    console.log(req.body)
    req.body.username = req.body.username.replace(/ /g, "")
    req.body.username = req.body.username.toLowerCase()
    
    const {username, password} = req.body  
    if (!username || !password){ 
        return  res.send({message: "You must provide email and password"})
      }
    // we destructure so as to have access to the email and password sent during request without having to do
    // req.body.email or req.body.password
    try{
    
    const member = new Member({
        username: username,
        password: password
    })
      
    await member.save()
    console.log("created")

    // CREATING A Json web TOken

    const token = jwt.sign({userId: member._id}, "MY_SECRET_KEY")
    // user._id is the id of the user gotten from the database...secret key can be any string

    res.send({token: token, message: "success"})

     } catch (err){
        //  if(!email || !password){
        //      return res.send("please enter email / password")
        //  }
        //  else{
        return res.send({message: "user already exist"})  // the return will simply not allow execution of anycode after this line
    //}
}
})

router.post('/signin', async(req, res) => {
    req.body.username = req.body.username.replace(/ /g, "")
    const {username, password} = req.body
    console.log(req.body)
    
    console.log(req.body.username)
    
    if (!username || !password){ 
      return  res.send({message: "You must provide email and password"})
    }
    
   const member = await Member.findOne({username: username})
    // we are using await because the operation(asynchronous) is going to take some time as 
    // mongoose has to reach out to MongoDB database

    //NOTE: the user value gotten from the database will contain existing email and hashed password

    if(!member){
        return res.send({message: "Invalid password or email"})
    }
    else{
        try{
           await member.comparePassword(password)
           const token = jwt.sign({userId: member._id}, "MY_SECRET_KEY")  //{expiresIn: "6s"} or "6d" or "6h"
           res.send({token: token, message: "success"})
           console.log("welcome to your account")
        }
        catch(err){
            return res.send({message: "Invalid password or username"})
        }
    }
})




module.exports = router