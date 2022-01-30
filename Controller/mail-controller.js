const nodemailer = require('nodemailer')
const config = require('config')
exports.forgetPassword  = (req, res) => {
    let transporter = nodemailer.createTransport({
        sendmail: true,
        newline: 'unix',
        path: '/usr/sbin/sendmail'
    });
    transporter.sendMail({
        from: 'sender@example.com',
        to: req.body.email,
        subject: 'Message',
        text: 'I hope this message gets delivered!'
    }, (err, info) => {
        console.log(info.envelope);
        console.log(info.messageId);
    });



}
