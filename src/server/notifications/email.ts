
import nodemailer from "nodemailer"
import SMTPTransport from "nodemailer/lib/smtp-transport";

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
        user: String(process.env.MAIL_USERNAME),
        pass: String(process.env.MAIL_PASSWORD),
    }
}

const transporter = nodemailer.createTransport((process.env.NODE_ENV == 'production') ? PRODUCTION_OPTIONS : DEV_OPTIONS);

export async function sendMail() {
    const info = await transporter.sendMail({
        from: '"Maddison Foo Koch 👻" <maddison53@ethereal.email>', // sender address
        to: "jimmie.fisher@ethereal.email", // list of receivers
        subject: "Hello ✔", // Subject line
        text: "Hello world?", // plain text body
        html: "<b>Hello world?</b>", // html body
    });
    
    console.log("Message sent: %s", info.messageId);
    
}

sendMail().catch(console.error);