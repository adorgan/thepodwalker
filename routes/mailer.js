var nodeMailer = require("nodemailer");

var transporter = nodeMailer.createTransport({
    pool: true,
    service: 'gmail',
    auth: {
        user: 'thepodwalker@gmail.com',
        pass: process.env.PASSWORD_GMAIL
    }
});

module.exports = transporter;