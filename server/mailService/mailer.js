import nodemailer from 'nodemailer';
import Smtp from '../models/smtpModel.js';

export const createTransporter = async (smtpConfig) => {
  try {
    if (!smtpConfig) {
      throw new Error('SMTP configuration not found');
    }

    return nodemailer.createTransport({
      host: smtpConfig.host,
      port: smtpConfig.port,
      secure: smtpConfig.protocol === 'ssl',
      auth: {
        user: smtpConfig.username,
        pass: smtpConfig.password,
      },
    });
  } catch (error) {
    throw new Error(`Failed to create mail transporter: ${error.message}`);
  }
};

export const sendEmail = async (smtpConfig, { to, subject, html }) => {
  try {
    const transporter = await createTransporter(smtpConfig);
    
    const result = await transporter.sendMail({
      from: smtpConfig.username,
      to,
      subject,
      html,
    });
    
    return result;
  } catch (error) {
    throw new Error(`Failed to send email: ${error.message}`);
  }
};
