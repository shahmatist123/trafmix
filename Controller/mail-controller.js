const nodemailer = require('nodemailer')
const config = require('config')
exports.forgetPassword  = (req, res) => {
    async function send (){
        let testAccount = await nodemailer.createTestAccount();
        let transporter = nodemailer.createTransport({
            port: 587,
            secure: false, // true for 465, false for other ports
            auth: {
                user: testAccount.user, // generated ethereal user
                pass: testAccount.pass, // generated ethereal password
            },
        });
       const info = await transporter.sendMail({
            from: 'sender@example.com',
            to: req.body.email,
            subject: 'Message',
            text: 'I hope this message gets delivered!'
        }, (err, info) => {
        });
       console.log(info)
    }
    send().catch(error =>{
        console.log(error)
    });




}
