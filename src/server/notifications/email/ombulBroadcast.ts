import 'server-only'
import nodemailer from "nodemailer"
import SMTPPool from 'nodemailer/lib/smtp-pool';
import { TRANSPORT_OPTIONS } from './ConfigVars';
import SMTPTransport from 'nodemailer/lib/smtp-transport';
import { SendEmailValidation, sendEmailValidation } from './validation';

const PROD = process.env.NODE_ENV === "production"

type Transporter = nodemailer.Transporter<SMTPPool.SentMessageInfo | SMTPTransport.SentMessageInfo>

class OmbulBroadcast {

    transporter: Transporter | null = null;
    resolveSetup: (value?: unknown) => void = () => {};
    waitForSetup = new Promise((resolve) => this.resolveSetup = resolve)
    testAccount: nodemailer.TestAccount | null = null;

    constructor() {
        this.setup();
    }

    async setup() {
        if (PROD) {
            this.transporter = nodemailer.createTransport(TRANSPORT_OPTIONS)
            this.resolveSetup();
            console.log("Email setup in production")
            return;
        }

        this.testAccount = await nodemailer.createTestAccount();

        this.transporter = nodemailer.createTransport({
            pool: true,
            host: 'smtp.ethereal.email',
            port: 587,
            secure: false,
            auth: {
                user: this.testAccount.user, // generated ethereal user
                pass: this.testAccount.pass  // generated ethereal password
            }
        })

        this.resolveSetup();
        console.log("Email setup in development. Test account details:")
        console.log(this.testAccount)
    }

    async getTransporter(): Promise<Transporter> {
        if (this.transporter) {
            return this.transporter
        }

        await this.waitForSetup
        if (!this.transporter) {
            throw new Error("Transporter is not set after setup, this should never happen.")
        }

        return this.transporter
    }

    async getTestAccount(): Promise<nodemailer.TestAccount> {
        if (PROD) {
            throw new Error("TestAccount should only be used in development")
        }

        if (this.testAccount) {
            return this.testAccount
        }

        await this.waitForSetup

        if (!this.testAccount) {
            throw new Error("Test account ins not set after setup, this should never happen.")
        }

        return this.testAccount
    }

    async sendSingleMail(data: SendEmailValidation['Detailed']) {
        const parse = sendEmailValidation.detailedValidate(data);

        const transporter = await this.getTransporter();
    
        const sender = PROD ? parse.sender : (await this.getTestAccount()).user;

        const info = await transporter.sendMail({
            from: sender,
            to: parse.recipient,
            subject: parse.subject,
            text: parse.text,
        });
        
        console.log(`MAIL SENT: ${parse.sender}${PROD ? "" : "(" + sender + ")"} -> ${parse.recipient}`)
        console.log(info.response)
        
        if (!PROD) {
            console.log(`EMAIL SENT, preview: ${nodemailer.getTestMessageUrl(info)}`)
        }
    }
}

export const ombulBroadcast = new OmbulBroadcast();