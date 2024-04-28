import 'server-only'
import nodemailer from "nodemailer"
import { SendEmailValidation, sendEmailValidation } from './validation';
import { getTestAccount, getTransporter } from './setup';

const PROD = process.env.NODE_ENV === "production"

export async function sendMail(rawdata: SendEmailValidation['Detailed']) {

    const parse = sendEmailValidation.detailedValidate(rawdata);
    
    const transporter = await getTransporter();
    
    const sender = PROD ? rawdata.sender : (await getTestAccount()).user;
    console.log("hei")

    const info = await transporter.sendMail({
        from: sender,
        to: parse.recipient,
        subject: parse.subject,
        text: parse.text,
    });
    
    console.log(`MAIL SENT: ${parse.sender}${PROD ? "" : "(" + sender + ")"} -> ${parse.recipient}`)
    
    if (!PROD) {
        console.log(`EMAIL SENT, preview: ${nodemailer.getTestMessageUrl(info)}`)
    }

}

