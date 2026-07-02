const nodemailer = require('nodemailer');
const logger = require('../utils/logger');
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || 'smtp.gmail.com',
  port: process.env.EMAIL_PORT || 587,
  secure: false,
  auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
});
exports.sendWelcomeEmail = async (to, name) => {
  await transporter.sendMail({ from: `"ShopHub" <${process.env.EMAIL_USER}>`, to, subject: 'Welcome!', html: `<h1>Welcome, ${name}!</h1><p>Thank you for joining.</p>` });
};
