const nodemailer = require('nodemailer')
const config = require('config')
exports.forgetPassword  = (req, res) => {
    function foo(email, password) {
        nodemailer.createTestAccount(function(err, account) {
            var transporter = nodemailer.createTransport({
                host: 'smtp.ethereal.email',
                port: 587,
                secure: true,
                auth: {
                    user: account.user,
                    pass: account.pass
                }
            });

            var message = {
                from: 'trafmix.herokuapp@no-reply.com',
                to: email,
                subject: 'Регистрация ✔',
                text: 'Твой пароль: '+ password,
                html: 'Твой пароль:<b> '+ password+'</b>'
            };

            transporter.sendMail(message, function (err, info) {
                if (err) {
                    console.log('Error:' + err.message);
                    return;
                }
                console.log('Server responded with ' + info.response);
            });
        });
    }
    foo(123,'asdasdas')


}
