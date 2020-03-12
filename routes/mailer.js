var nodeMailer = require("nodemailer"),
    passwords = require("../private/passwords");

var transporter = nodeMailer.createTransport({
    pool: true,
    service: 'gmail',
    auth: {
        user: 'thepodwalker@gmail.com',
        pass: passwords.passwordGmail
    }
});

module.exports = transporter;