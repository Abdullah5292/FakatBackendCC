const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {

        user: "contactmanager29@gmail.com",
        pass: "ymlh ogac tezv gtru"
    }
});

module.exports = transporter;
