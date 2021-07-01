let fetch = require('node-fetch');
let mailer = require('nodemailer');
const fs = require('fs');

const mailObject = JSON.parse(fs.readFileSync('./credentials.json'));
const fromMailer = mailObject.fromMailer.mail;
const toFirstMailer = mailObject.toMail.firstmail;
const toSecondMailer = mailObject.toMail.secondmail;
const fromMailerPassword = mailObject.fromMailer.password;

const minutesToRetry = 2400000 // 40 minutes = 2400000 ms, 30 seconds = 30000 ms

let transporter = mailer.createTransport({
    service: mailObject.fromMailer.service,
    auth: {
        user: fromMailer,
        pass: fromMailerPassword
    }
})



function fechThePage(webpage, fromMailer, toFirstMailer, toSecondMailer) {
    try {
        
        fetch(webpage)
        .catch(err => {
            console.error(`La página ${webpage} respondio con el error: ${err.code}`)
            transporter.sendMail(mailOptions = {
                from: fromMailer,
                to: toFirstMailer + ', ' + toSecondMailer,
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

        .then(res => {
            console.log('Res status: ' + res.statusText)
        })
        .then(setTimeout(fechThePage, minutesToRetry, webpage, fromMailer, toFirstMailer))

    } catch (error) {
        console.error("TRY CATCH ERROR: "+ error)
    }

}


setTimeout(fechThePage, minutesToRetry, 'https://chat.smsmasivos.biz/Admin/Login', fromMailer, toFirstMailer, toSecondMailer);