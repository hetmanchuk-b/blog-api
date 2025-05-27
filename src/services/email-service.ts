import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  }
});

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
}

export const sendEmail = async ({to, subject, html}: EmailOptions): Promise<void> => {
  const mailOptions = {
    from: `"Blog Website" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html
  }

  return new Promise((resolve, reject) => {
    transporter.sendMail(mailOptions, (error: any) => {
      if (error) {
        reject(error);
      } else {
        resolve();
      }
    })
  });
}