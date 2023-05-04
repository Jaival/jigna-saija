import nodemailer from 'nodemailer';

const user = process.env.userEmail;
const pass = process.env.userPass;
const to = process.env.toEmail;

// create reusable transporter object using the default SMTP transport
export const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: user,
    pass: pass,
  },
});

export const mailOptions = {
  from: user,
  to: to,
};
