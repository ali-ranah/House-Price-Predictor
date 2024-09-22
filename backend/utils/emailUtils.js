// utils/emailUtils.js
const nodemailer = require('nodemailer');

// Create transporter for sending emails
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'sherjankhan121@gmail.com',
        pass: 'yyhvhossgknxyeek'
    }
});

// Function to send verification code email
const sendVerificationEmail = (email, verificationCode, callback) => {
    const mailOptions = {
        from: 'sherjankhan121@gmail.com',
        to: email,
        subject: 'Password Reset Verification Code',
        text: `Your verification code is: ${verificationCode}. This code will expire in 5 minutes.`
    };

    transporter.sendMail(mailOptions, callback);
};

module.exports = sendVerificationEmail;
