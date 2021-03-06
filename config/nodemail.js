"use strict";
const nodemailer = require("nodemailer");
const authController = require("../controllers/authController");

// async..await is not allowed in global scope, must use a wrapper
exports.sendverification = function (email, permalink, verification_token) {
    async function main() {
    // Generate test SMTP service account from ethereal.email
    // Only needed if you don't have a real mail account for testing
    let testAccount = await nodemailer.createTestAccount();

    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
        host: "smtp.ethereal.email",
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
        user: 'monserrate.mayert39@ethereal.email', // generated ethereal user & dummy email
        pass: 'A6bWgNab6wXJ5URMEQ', // generated ethereal password
        },
    });

    // send mail with defined transport object
    let info = await transporter.sendMail({
        from: "RainbowWarriors 🌈👻", // sender address
        to: email, // list of receivers
        subject: "Hello ✔", // Subject line
        text: "Here is your verification token. Please click the link.", // plain text body
        html: '<p>Here is your verification token. Please click the link.</p><br><a href="localhost:3000/users/verify/' // hvorfor virker det her ? når router er omvendt 
        + verification_token + '/' + permalink + '">Click me</a>'// html body
    });

    console.log("email sent with", info);
    console.log("Message sent: %s", info.messageId);
    // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

    // Preview only available when sending through an Ethereal account
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
    // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
    }

    main().catch(console.error);

    //Kode lånt af Nodemailer
}
