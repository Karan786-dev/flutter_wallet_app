const nodemailer = require('nodemailer')
const { mail, mail_password } = require('../config').nodemail

var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: mail,
        pass: mail_password
    },
    tls: {
        rejectUnauthorized: false
    }
})

module.exports = (
    to,
    text = 'Hello World',
    subject = 'Subject'
) => {
    return transporter.sendMail({
        from: mail,
        to: to,
        subject: subject,
        text: text
    },
        function (error, info) {
            if (error) console.log(error)
        }
    )
}