import nodemailer, { Transporter, SendMailOptions } from 'nodemailer';

// Define TypeScript interfaces for better type safety
export interface EmailConfig {
  from: string;
  to: string | string[];
  subject?: string;
  text?: string;
  html?: string;
}

// Get environment variables with validation
const user = process.env.userEmail;
const pass = process.env.userPass;
const to = process.env.toEmail;

// Validate required environment variables
if (!user || !pass) {
  console.error('Email configuration error: userEmail and userPass environment variables are required');
  // Depending on your application's needs, you might want to throw an error here
  // throw new Error('Email configuration missing');
}

// Create reusable transporter object using the default SMTP transport
export const transporter: Transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user:user,
    pass:pass,
  },
});

// Default mail options
export const mailOptions: SendMailOptions = {
  from: user,
  to,
};

// Helper function to send emails more easily
export const sendEmail = async (options: EmailConfig): Promise<nodemailer.SentMessageInfo> => {
  try {
    return await transporter.sendMail({
      ...mailOptions,
      ...options,
    });
  } catch (error) {
    console.error('Failed to send email:', error);
    throw error;
  }
};
