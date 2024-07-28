const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail', // You can use other email services
    auth: {
        user: 'noreply.lyxux@gmail.com',
        pass: 'nkkj eyug rctm yhni',
    },
});

const sendOtpEmail = (otp, recipientEmail) => {
    const mailOptions = {
        from: 'noreply.lyxux@gmail.com',
        to: 'ishanhimalka1@gmail.com',
        subject: 'Your OTP for Registration',
        text: `Your OTP for registration is: ${otp}`,
    };

    return transporter.sendMail(mailOptions);
};

module.exports = sendOtpEmail;