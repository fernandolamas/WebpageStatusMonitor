let fetch = require('node-fetch');
let mailer = require('nodemailer');
const fs = require('fs');

const mailObject = JSON.parse(fs.readFileSync('./credentials.json'));
const fromMailer = mailObject.fromMailer.mail
const toMailer = mailObject.toMail.mail
const fromMailerPassword = mailObject.fromMailer.password

const minutesToRetry = 2400000 // 40 minutes, 30 seconds for

let passwordFile = JSON.parse(fs.readFileSync('./credentials.json'));
let transporter = mailer.createTransport({
    service: mailObject.fromMailer.service,
    auth: {
        user: fromMailer,
        pass: fromMailerPassword
    }
})

function fechThePage(webpage, fromMailer, toMailer) {
    fetch(webpage)
        .catch(err => {
            console.error(`La página ${webpage} respondio con el error: ${err.code}`)
            transporter.sendMail(mailOptions = {
                from: fromMailer,
                to: toMailer,
                subject: `Se cayo la página ${webpage}`,
                text: `La página ${webpage} está caida, al intentar establecer conección con la página el sistema respondió: ${err.code}`
            }, function (error, data) {
                if (error) {
                    console.log(error);
                } else {
                    console.log(`Email sent: ${data.response}`)
                }
            })
        })

        .then(res => function () { if (!err) { res.text() } })
        .then(body => function () { if (!err) { console.log(body) } })
        .then(setTimeout(fechThePage,minutesToRetry,'https://www.google.com:81',fromMailer,toMailer))

}


setTimeout(fechThePage,minutesToRetry,'https://www.google.com:81',fromMailer,toMailer);