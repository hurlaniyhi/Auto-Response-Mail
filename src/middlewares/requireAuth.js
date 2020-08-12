const jwt = require("jsonwebtoken")
const mongoose = require('mongoose')
const Member = mongoose.model('Member')


module.exports = (req, res, next) => {
    const {authorization} = req.headers
    // authorization === "Bearer ourToken"

    if (!authorization){
        return res.send("You must be logged in")
    }
    else{
        const token = authorization.replace("Bearer ", "")

        jwt.verify(token, "MY_SECRET_KEY", async(err, payload) => {
            if(err){
                return res.send("You must be logged in")
            }
            else{
                const {userId} = payload
                const member = await Member.findById(userId)
                req.member = member
                next()
            }
        })
    }
}