import 'server-only'
import nodemailer from "nodemailer"
import SMTPTransport from "nodemailer/lib/smtp-transport";
import { SendEmailValidation } from './validation';

const PRODUCTION_OPTIONS : SMTPTransport.Options = {
    host: process.env.MAIL_SERVER,
    port: 587,
    tls: {
        rejectUnauthorized: true,
        minVersion: "TLSv1.2",
    },
}

const DEV_OPTIONS : SMTPTransport.Options = {
    host: String(process.env.MAIL_SERVER),
    port: 587,
    auth: {
        user: String(process.env.DEVELOPMENT_ETHEREAL_USERNAME),
        pass: String(process.env.DEVELOPMENT_ETHEREAL_PASSWORD),
    }
}

const transporter = nodemailer.createTransport((process.env.NODE_ENV == 'production') ? PRODUCTION_OPTIONS : DEV_OPTIONS);

export async function sendMail(rawdata: SendEmailValidation['Detailed']) {

    const info = await transporter.sendMail({
        from: rawdata.sender, // sender address
        to: rawdata.recipient, // list of receivers
        subject: rawdata.subject, // Subject line
        text: rawdata.text, // plain text body
    });
    
    console.log("Message sent: %s", info.messageId);
}