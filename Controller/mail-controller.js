const nodemailer = require('nodemailer')
const config = require('config')
exports.forgetPassword  = (req, res) => {
    const promise = new Promise(() =>{
        const transporter = nodemailer.createTransport({
            port: 25, //port
            host: 'trafmix.herokuapp.com',
            use_authentication: false,
        })
    })
    promise.then(() =>{
        let result = transporter.sendMail({
            from: config.get('email'),
            to: req.body.email,
            subject: 'Message from Node js',
            text: 'This message was sent from Node js server.',
            html:
                'This <i>message</i> was sent from <strong>Node js</strong> server.',
        })
        console.log(result)
    })



}
