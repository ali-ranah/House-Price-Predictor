// // utils/emailUtils.js
// const nodemailer = require('nodemailer');


// // Function to send verification code email
// const sendVerificationEmail = (email, verificationCode, callback) => {
    // const mailOptions = {
    //     from: 'sherjankhan121@gmail.com',
    //     to: email,
    //     subject: 'Password Reset Verification Code',
    //     text: `Your verification code is: ${verificationCode}. This code will expire in 5 minutes.`
    // };

//     transporter.sendMail(mailOptions, callback);
// };

// module.exports = sendVerificationEmail;


const nodemailer = require('nodemailer');

async function sendEmail({ email, subject, verificationCode = '', type, name = '',offerPrice,verificationLink=''}) {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    port: 587,
    secure: false, // Use TLS
    auth: {
      user: process.env.smtp_email,
      pass: process.env.smtp_password,
    },
  });

// const logoImage = 'https://res.cloudinary.com/dqlyxvgcc/image/upload/v1726153699/logo3_iejcu4.png';

  let htmlContent = '';

  const emailFooter = `
<div style="display: flex; align-items: center; justify-content: center; padding-top: 20px;">
  <p style="color: #555; margin: 0; font-size: 16px;">
    Best regards,<br>
    <strong>House Price Predictor Security Team</strong>
  </p>
</div>
  `;

  // Email body content based on the type
  if (type === 'welcome') {
    htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px; box-shadow: 0 0 10px rgba(0,0,0,0.1);">
        <h2 style="color:#2C3E50; text-align: center;">Welcome to House Price Predictor!</h2>
        <p style="color: #555;">Dear ${name ? name : 'User'},</p>
        <p style="color: #555;">Thank you for registering with House Price Predictor! We're excited to have you join our community. Your account has been successfully created, and you’re all set to explore everything our platform has to offer.</p>
        <p style="color: #555;">If you have any questions or need assistance, feel free to reach out to our support team at any time.</p>
        <p style="color: #555;">Welcome aboard, and happy browsing!</p>
        ${emailFooter}
      </div>
    `;
  } else if (type === 'verify') {
    htmlContent = `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px; box-shadow: 0 0 10px rgba(0,0,0,0.1);">
    <h2 style="color:#2C3E50; text-align: center;">Reset Your Password</h2>
    <p style="color: #555;">Dear ${name ? name : 'User'},</p>
    <p style="color: #555;">We received a request to reset your password. To proceed, please click the link below to reset your password:</p>
    <div style="background-color: #ffffff; border-radius: 5px; font-size: 12px; font-weight: bold; color: #2C3E50; margin-bottom: 20px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); text-align: center;">
      <p style="font-size: 20px; font-weight: bold; color: #2C3E50; text-align: center; background-color: #f8f8f8; padding: 10px; border-radius: 5px; margin: 20px 0;">
        ${verificationCode}
      </p>
    </div>
    <p style="color: #555;">Please note that this link will expire in 30 minutes. If you did not request a password reset, please ignore this email.</p>
    <p style="color: #555;">If you have any questions or need further assistance, feel free to reach out to our support team.</p>
    ${emailFooter}
   </div>
`;
  } else if (type === 'reset') {
    htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px; box-shadow: 0 0 10px rgba(0,0,0,0.1);">
        <h2 style="color:#2C3E50; text-align: center;">Password Reset Confirmation</h2>
        <p style="color: #555;">Dear ${name ? name : 'User'},</p>
        <p style="color: #555;">Your password has been successfully updated.</p>
        <p style="color: #555;">If you did not make this change, please contact our support team immediately.</p>
        <p style="color: #555;">For your security, do not share your account details with anyone.</p>
        ${emailFooter}
       </div>
    `;
  }else if (type === 'bid_notification') {
    htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px; box-shadow: 0 0 10px rgba(0,0,0,0.1);">
        <h2 style="color:#2C3E50; text-align: center;">New Bid Placed on Your Property</h2>
        <p style="color: #555;">Dear ${name},</p>
        <p style="color: #555;">A new bid of <strong>PKR${offerPrice}</strong> has been placed on your property. You can log in to your account to view the details and respond to this bid.</p>
        <p style="color: #555;">Thank you for using House Price Predictor!</p>
        ${emailFooter}
      </div>
    `;
  }else if (type === 'offerAccepted') {
    htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px;">
        <h2>Congratulations! Your Offer was Accepted</h2>
        <p>Dear ${name},</p>
        <p>We are pleased to inform you that your offer has been accepted for the property. Please proceed with the next steps for ownership transfer.</p>
        ${emailFooter}
      </div>
    `;
} else if (type === 'offerRejected') {
    htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px;">
        <h2>We're Sorry! Your Offer was Rejected</h2>
        <p>Dear ${name},</p>
        <p>Unfortunately, your offer for the property was not accepted. We encourage you to explore other available properties on our platform.</p>
        ${emailFooter}
      </div>
    `;
} else if(type === 'account_verification'){
  htmlContent =`
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px; box-shadow: 0 0 10px rgba(0,0,0,0.1);">
  <h2 style="color:#2C3E50; text-align: center;">Verify Your Email Address</h2>
  <p style="color: #555;">Dear ${name ? name : 'User'},</p>
  <p style="color: #555;">Thank you for signing up with <strong>House Price Predictor</strong>. To complete your registration, please verify your email address by clicking the link below:</p>
  <div style="text-align: center; margin: 20px 0;">
    <a href="${verificationLink}" style="background-color: #2C3E50; color: #fff; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-size: 16px; display: inline-block;">Verify Email</a>
  </div>
  <p style="color: #555;">If the button above does not work, copy and paste the following link into your browser:</p>
  <p style="color: #2C3E50; word-wrap: break-word;">${verificationLink}</p>
  <p style="color: #555;">If you did not request this email, please ignore it.</p>
  ${emailFooter}
</div>`
}else if(type ==='verification_success'){
  htmlContent = `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px; box-shadow: 0 0 10px rgba(0,0,0,0.1);">
  <h2 style="color:#2C3E50; text-align: center;">Email Verified Successfully</h2>
  <p style="color: #555;">Dear ${name},</p>
  <p style="color: #555;">Congratulations! Your email address has been successfully verified. You can now enjoy full access to all the features of <strong>House Price Predictor</strong>.</p>
  <p style="color: #555;">If you have any questions or need assistance, feel free to contact our support team.</p>
  ${emailFooter}
</div>`
}

  const mailOptions = {
    from: `"House Price Predictor Security Team" <${process.env.smtp_email}>`,
    to: email,
    subject: subject,
    html: htmlContent,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Email sent successfully');
  } catch (error) {
    console.error('Failed to send email:', error);
    throw new Error('Failed to send email.');
  }
}

module.exports = sendEmail;
