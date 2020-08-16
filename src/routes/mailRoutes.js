const express = require('express')
const mongoose = require('mongoose')
const nodemailer = require('nodemailer')
const requireAuth = require('../middlewares/requireAuth')
const multer = require('multer')
const path = require("path")

const Mail = mongoose.model('Mail')

const router = express()

router.use(requireAuth)  // to make all our routes here to pass through the requireAuth middleware...instead of apply it to each route one by one


// Fetch tracks from database
router.get('/mails', async (req, res) => {
    console.log("welcome")
    
    const mails = await Mail.find({}) 
    res.send({message: "success", mail: mails})

})

router.post('/invitation', async (req, res)=>{
    const{receiverEmail, receiverName} = req.body
   
    if(!receiverEmail || !receiverName) {
        return res.send({message: "you must provide an email and receiverName"})
    }

   else{
    let transporter =  nodemailer.createTransport({
     
         
        // service: 'gmail',
        host: "smtp.gmail.com",
     port: 465,
     secure: true,
          auth: {
            user: 'gtfintech@gmail.com',
            // pass: 'ridwan152'
            pass: "rncvncbwdrixbscw"
          },
    
        });
      
        
        let mailOptions = {
          from: '"API Connect (GTBank)" <fintech.request@gmail.com>', 
          to: receiverEmail, 
          subject: 'Invitation to use our APIs', 
          html: `
            
            <table>
          
              <tr>
                <td>
                  <img src="https://res.cloudinary.com/dcx4utzdx/image/upload/v1595954364/blog/2020-07-28T16:40:12.645Z.png" 
                  style="width: 95%; margin-left: 2.5%; margin-right: 2.5%" />
                </td>
              </tr>

              <tr>
                <td>
                  <div style="width: 80%; margin-left: 10%; margin-right: 10%">
                    <p style="padding-bottom: 3%">Dear ${receiverName},</p>
                    <p>GTBank API developer portal is built to allow third party developers integrate with our APIs easily.</p>
                    <p>Take advantage of our API offerings grouped into Payments, Accounts, Identity and build best in class products and solutions that speak to our customers' needs.</p>
                    <p>We are hereby specially inviting you and your team to join the pilot test of the sandbox before we launch. 
                    Kindly share the email address of the person/persons to test the APIs so we can approve after an account has been created.</p>
                    <p>Learn more at <a href="https://developer.gtbank.com">https://developer.gtbank.com</a></p>
                    </div>
                </td>
              </tr>

              <tr>
                <td>
                  <img src="https://res.cloudinary.com/dcx4utzdx/image/upload/v1595956228/blog/2020-07-28T17:11:14.703Z.png" 
                  style="width: 95%; margin-left: 2.5%; margin-right: 2.5%" />
                </td>
              </tr>
        
            </table>  
          `
             
        };
      
        
      await transporter.sendMail(mailOptions, async(error,info)=>{
            
          if(error){
               console.log(error)
              return res.send({message: "Error occur when sending mail"})
          } 
        else{
          console.log("Message sent: %s", info.messageId);
          // res.send("email has been sent")

         
        }
  
        
        })
        var today = new Date
        var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate()
        var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds()

      
          const mail = new Mail({
              mailType: "Invitation",
              sender: req.member.username,
              date: date,
              time: time,
              receiverName: receiverName,
              receiverEmail
          })
          await mail.save()
          console.log("saved")
          res.send({message: "success", mail: mail})
        
   }


})



router.post('/approval', async (req, res)=>{
  const{receiverEmail, receiverName, applicationName} = req.body
 
  if(!receiverEmail || !receiverName || !applicationName) {
      return res.send({message: "you must provide an email and receiverName"})
  }

 else{
  let transporter =  nodemailer.createTransport({
   
       
       //service: 'gmail',
       host: "smtp.gmail.com",
     port: 465,
     secure: true,
        auth: {
          user: 'gtfintech@gmail.com',
          //pass: 'ridwan152'
          pass: "rncvncbwdrixbscw"
        },
  
      });
    
      
      let mailOptions = {
        from: '"API Connect (GTBank)" <fintech.request@gmail.com>', 
        to: receiverEmail, 
        subject: 'Approval to go live', 
       // text: `Dear ${receiverName}, we have different API's you can use.`,
        html: `
          
          <table>
          
            <tr>
              <td>
                <img src="https://res.cloudinary.com/dcx4utzdx/image/upload/v1595966324/blog/2020-07-28T19:59:32.490Z.png" 
                style="width: 95%; margin-left: 2.5%; margin-right: 2.5%" />
              </td>
            </tr>

            <tr>
              <td>
                <div style="width: 80%; margin-left: 10%; margin-right: 10%">
                  <p>Dear ${receiverName},</p>
                  <p>Your request to migrate from development plan to production environment has been carefully reviewed.</p>
                  <p>We are happy to inform you that your request has been granted and your application (${applicationName}) has been 
                  successfully migrated from the sandbox to live plan</p>
                  <p>Kindly note that a lien has been placed on the organization bank account you filled on the Go-Live form and 
                  an email on your daily consumption would be shared with you.</p>
                  <p>Welcome to GTBank API Community.</p>  
                  <p>Learn more at <a href="https://developer.gtbank.com">https://developer.gtbank.com</a></p>
                </div>        
              </td>
            </tr>

            <tr>
              <td>
                <img src="https://res.cloudinary.com/dcx4utzdx/image/upload/v1595966422/blog/2020-07-28T20:01:12.087Z.png" 
                style="width: 95%; margin-left: 2.5%; margin-right: 2.5%" />
              </td>
            </tr>
        
          </table>  
          `
      
      };
    
      
    await transporter.sendMail(mailOptions, async(error,info)=>{
          
        if(error){
          console.log(error)
          return res.send({message: "Error occur when sending mail"})
        } 
      else{
        console.log("Message sent: %s", info.messageId);
        // res.send("email has been sent")
        
       
      } 

      
      
      })
     
      var today = new Date
      var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate()
      var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds()

     
        const mail = new Mail({
            mailType: "Approval",
            sender: req.member.username,
            date: date,
            time: time,
            receiverName: receiverName,
            receiverEmail
        })
        await mail.save()
        console.log("saved")
        res.send({message: "success", mail: mail})
      
 }


})


router.post('/launchSoon', async (req, res)=>{
  const{receiverEmail, receiverName} = req.body
 
  if(!receiverEmail || !receiverName) {
      return res.send({message: "you must provide an email and receiverName"})
  }

 else{
  let transporter =  nodemailer.createTransport({
   
       
     //  service: 'gmail',
     host: "smtp.gmail.com",
     port: 465,
     secure: true,
        auth: {
          user: 'gtfintech@gmail.com',
          pass: 'rncvncbwdrixbscw'
        },
  
      });
    
      
      let mailOptions = {
        from: '"API Connect (GTBank)" <fintech.request@gmail.com>', 
        to: receiverEmail, 
        subject: 'API Connect Subscription Request', 
       // text: `Dear ${receiverName}, we have different API's you can use.`,
        html: `
          
          <table>
          
            <tr>
              <td>
                <img src="https://res.cloudinary.com/dcx4utzdx/image/upload/v1595967472/blog/2020-07-28T20:18:29.071Z.png" 
                style="width: 95%; margin-left: 2.5%; margin-right: 2.5%" />
              </td>
            </tr>

            <tr>
              <td>
                <div style="width: 80%; margin-left: 10%; margin-right: 10%">
                  <p>Hello ${receiverName},</p>
                  <p>Thank you for your interest in GTBank APIs. We are currently working on some finishing 
                  touches before our final launch of the developer portal. This would be done as soon as possible. 
                  Kindly exercise patience as we put things in place.</p>
                  <p>We would inform you when the developer portal is finally up for use.</p>
                  <p>Learn more at <a href="https://developer.gtbank.com">https://developer.gtbank.com</a></p>
                  <p>Thank you.</p>  
                </div> 
              </td>
            </tr>

            <tr>
              <td>
                <img src="https://res.cloudinary.com/dcx4utzdx/image/upload/v1595967550/blog/2020-07-28T20:19:56.387Z.png" 
                style="width: 95%; margin-left: 2.5%; margin-right: 2.5%"/>
              </td>
            </tr>
        
          </table>  
          `
        
      };
    
      
     await transporter.sendMail(mailOptions, (error,info)=>{
          
        if(error){
             console.log(error)
            return res.send({message: "Error occur when sending mail"})
        } 
      else{
        console.log("Message sent: %s", info.messageId);
        // res.send("email has been sent")

        
        }
   
  
        
      
      })
    
      var today = new Date
      var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate()
      var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds()

     
        const mail = new Mail({
            mailType: "Auto Response",
            sender: req.member.username,
            date: date,
            time: time,
            receiverName: receiverName,
            receiverEmail
        })
        await mail.save()
        console.log("saved")
        res.send({message: "success", mail: mail})
   
 }


})





router.post('/priceList', async (req, res)=>{
  const{receiverEmail, receiverName, applicationName} = req.body
 
  if(!receiverEmail || !receiverName || !applicationName) {
      return res.send({message: "you must provide an email, receiver name and application namw"})
  }

 else{
  let transporter =  nodemailer.createTransport({
   
       
      // service: 'gmail',
      host: "smtp.gmail.com",
   port: 465,
   secure: true,
        auth: {
          user: 'gtfintech@gmail.com',
          // pass: 'ridwan152'
          pass: "rncvncbwdrixbscw"
        },
  
      });
    
      
      let mailOptions = {
        from: '"API Connect (GTBank)" <fintech.request@gmail.com>', 
        to: receiverEmail, 
        subject: 'Upgrade to Production Request', 
        html: `
          
          <table>
        
            <tr>
              <td colspan= 2>
                <img src="https://res.cloudinary.com/dcx4utzdx/image/upload/v1595954364/blog/2020-07-28T16:40:12.645Z.png" 
                style="width: 95%; margin-left: 2.5%; margin-right: 2.5%" />
              </td>
            </tr>

            <tr>
              <td>
                <div style="width: 80%; margin-left: 10%; margin-right: 10%">
                  <p style="padding-bottom: 3%">Dear ${receiverName},</p>
                  
                  <p>We received your request to upgrade to production for the "finance application (${applicationName})" on your profile. 
                  Kindly reply this mail with the following documents pending the approval of your request:</p>
                  
                </div>
              </td>
            </tr>

            <tr>
              <td>
                <div style="width: 80%; margin-left: 12%; margin-right: 8%">
                  
                  <p>
                  <strong>1. </strong>Certificate of incorporation.
                  </p>

                  <p>
                  <strong>2. </strong>A valid means of identification of directors.
                  </p>

                  <p>
                  <strong>3. </strong>*Account details with GTBank with a minimum capital balance of #150,000 subject to change as you consume
                  our APIs.
                  </p>
              
                  <p>
                  <strong>4. </strong>A description of the registered company.
                  </p>

                  <p>
                  <strong>5. </strong>A description of the requested application.
                  </p>

                  <p>
                  <strong>6. </strong>An instruction letter authorizing the bank to debit account for the use of the APIs.
                  </p>
                </div>
              </td>
            </tr>

            <tr>
              <td>
                <div style="width: 80%; margin-left: 10%; margin-right: 10%">
                  <p style="padding-bottom: 3%">
                  *Please note that by accepting to upgrade to production, we are obliged to put a lien on your account for 
                  the minimum capital balance upon approval of the request.
                  </p>
                  <p>Find below the price list of the APIs:</p>
                </div>
              </td>
            </tr>
    
          </table> 

          
          <div style= "margin-left: 10%; width: 80%; margin-right: 10%">
            <table border=1px style="width: 100%; margin: auto; border-collapse: collapse">
              <tr>
                <td style="width: 10%; text-align: center">
                  <p><strong>S/N</strong></p>
                </td>

                <td style="width: 57%; text-align: center">
                  <p><strong>Account APIs</strong></p>    
                </td>

                <td style="width: 33%; text-align: center">
                  <p><strong>Price</strong></p>    
                </td>
              </tr>

              <tr>
                <td style="text-align: center">
                  <p>1</p>
                </td>

                <td style="text-align: center">
                  <p>Account opening with BVN</p>    
                </td>

                <td style="text-align: center">
                  <p><strong>NGN0.00</strong></p>    
                </td>
              </tr>

              <tr>
                <td style="text-align: center">
                  <p>2</p>
                </td>

                <td style="text-align: center">
                  <p>Account opening without BVN</p>    
                </td>

                <td style="text-align: center">
                  <p><strong>NGN0.00</strong></p>    
                </td>
              </tr>

              <tr>
                <td style="text-align: center">
                  <p>3</p>
                </td>

                <td style="text-align: center">
                  <p>Balance check</p>    
                </td>

                <td style="font-weight: bold; text-align: center">
                 <p style="display: inline-block">NGN</p><p style= "color: blue; display: inline-block">10.00</p>   
                </td>
              </tr>

              <tr>
                <td style="text-align: center">
                  <p>4</p>
                </td>

                <td style="text-align: center">
                  <p>Transaction history</p>    
                </td>

                <td style="font-weight: bold; text-align: center">
                <p style="display: inline-block">NGN</p><p style= "color: blue; display: inline-block">75.00</p>  
                </td>
              </tr>
            </table>
          </div>



          <div style= "margin-left: 10%; width: 80%; margin-right: 10%; margin-top: 3%">
            <table border=1px style="width: 100%; margin: auto; border-collapse: collapse">
              <tr>
                <td style="width: 10%; text-align: center">
                  <p><strong>S/N</strong></p>
                </td>

                <td style="width: 57%; text-align: center">
                  <p><strong>Payment APIs</strong></p>    
                </td>

                <td style="width: 33%; text-align: center">
                  <p><strong>Price</strong></p>    
                </td>
              </tr>

              <tr>
                <td style="text-align: center">
                  <p>1</p>
                </td>

                <td style="text-align: center">
                  <p>Intrabank transfer</p>    
                </td>

                <td style="font-weight: bold; text-align: center">
                <p style="display: inline-block">NGN</p><p style= "color: blue; display: inline-block">10.00</p>   
                </td>
              </tr>

              <tr>
                <td style="text-align: center">
                  <p>2</p>
                </td>

                <td style="text-align: center">
                  <p>Interbank transfer</p>    
                </td>

                <td style="font-weight: bold; text-align: center">
                <p style="display: inline-block">NGN</p><p style= "color: blue; display: inline-block">10.00</p>
                </td>
              </tr>

              
            </table>
              
          </div>


          <div style= "margin-left: 2.5%; width: 95%; margin-right: 2.5%; margin-top: 3%">
          <div style= "margin-left: 7.5%; width: 80%; margin-right: 7.5%; margin-bottom: 3%">
            <table border=1px style="width: 100%; margin: auto; border-collapse: collapse">
              <tr>
                <td style="width: 10%; text-align: center">
                  <p><strong>S/N</strong></p>
                </td>

                <td style="width: 57%; text-align: center">
                  <p><strong>Identity APIs</strong></p>    
                </td>

                <td style="width: 33%; text-align: center">
                  <p><strong>Price</strong></p>    
                </td>
              </tr>

              <tr>
                <td style="text-align: center">
                  <p>1</p>
                </td>

                <td style="text-align: center">
                  <p>Name lookup</p>    
                </td>

                <td style="text-align: center">
                  <p><strong>NGN0.00</strong></p>    
                </td>
              </tr>
              
            </table>
            <p style="padding-top: 2%">Please note prices attracts VAT @7.5%.</p>
            <p style="padding-top: 3%">Learn more at <a href="https://developer.gtbank.com">https://developer.gtbank.com</a></p>

          </div>
          
          <img src="https://res.cloudinary.com/dcx4utzdx/image/upload/v1595956228/blog/2020-07-28T17:11:14.703Z.png" 
              style="width: 100%" />
          </div>


        `
           
      };  
    
      
    await transporter.sendMail(mailOptions, async(error,info)=>{
          
        if(error){
             console.log(error)
            return res.send({message: "Error occur when sending mail"})
        } 
      else{
        console.log("Message sent: %s", info.messageId);
        // res.send("email has been sent")

       
      }

      
      })
      var today = new Date
      var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate()
      var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds()

    
        const mail = new Mail({
            mailType: "Upgrade to production Request",
            sender: req.member.username,
            date: date,
            time: time,
            receiverName: receiverName,
            receiverEmail
        })
        await mail.save()
        console.log("saved")
        res.send({message: "success", mail: mail})
      
 }


})




// router.post("/deletemails", async(req, res) => {
//   const del = await Mail.deleteMany({}, (err,doc)=>{
//     if(!err){
//       return res.send("success")
//     }
//   })
     
// })




// const storage = multer.diskStorage({
//   destination: function(req, file, cb){
//       cb(null, 'uploads/')
//   },
//   filename: function(req, file, cb){
//       console.log(file)
//       cb(null, file.originalname)
//   }
// })   

// router.post('/photo',(req,res)=>{
// const upload = multer({storage}).single('File')
// upload(req, res, function(err){
//    if(err){
//        return res.send(err)
//    }
//    console.log("file uploaded to server")
//    console.log(req.file)
   

//    const cloudinary = require('cloudinary').v2
//    cloudinary.config({
//        cloud_name: 'dcx4utzdx',
//        api_key: '226791946435464',
//        api_secret: 'yzsp3pOrvIEzFAhfMfWEIWXQmmA'
//    })
//    console.log("welcome to cloudinary")
//    const path = req.file.path
//    const uniqueFilename = new Date().toISOString()

//    cloudinary.uploader.upload(
//        path,
//        {
//            public_id: `blog/${uniqueFilename}`, tags: `blog`
//        },
//        function(err, image){
//            if(err) return console.log(err)
//            console.log("file uploaded to cloudinary")

//            const fs = require('fs')
//            fs.unlinkSync(path)
//            console.log(image)

//          res.send(image.secure_url)

//        }
//    )
// }
// )


// })

module.exports = router