const nodemailer= require('nodemailer')

const transporter=nodemailer.createTransport({
  host: "smtp.gmail.com",
port: 587,
secure: false, // Use `true` for port 465, `false` for all other ports
auth: {
  user: "chiragsharma000903@gmail.com",
  pass: "puqj xtrl ohob hfou",
},
});



// async..await is not allowed in global scope, must use a wrapper
const  SendWelcomeMail =async (email ,name)=> {
    // send mail with defined transport object
    const info = await  transporter.sendMail({
      from: '"Chirag Sharma" <chiragsharma000903@gmail.com>', // sender address
      to: email, // list of receivers
      subject: "Thanks For Joining In.", // Subject line
      html: `<b> Welcomw to the App, ${name} . Let me Know how you Get along With the app.</b>`, // html body
    });
  

  }



const sendCancelationMail= async (email, name)=>{
    
const info= await transporter.sendMail({
    from: '"Chirag Sharma" <chiragsharma000903@gmail.com>', // sender address
    to: email, // list of receivers
    subject: 'Sorry to see you go!', // Subject line
    html: `Goodbye ${name}. Hope to see you back sometime soon.`, // html body



    
})


}





  module.exports={ SendWelcomeMail,sendCancelationMail}
