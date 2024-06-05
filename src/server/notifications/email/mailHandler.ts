import 'server-only'
import { TRANSPORT_OPTIONS } from './ConfigVars'
import nodemailer from 'nodemailer'
import type SMTPPool from 'nodemailer/lib/smtp-pool'
import type SMTPTransport from 'nodemailer/lib/smtp-transport'
import type Mail from 'nodemailer/lib/mailer'

const PROD = process.env.NODE_ENV === 'production'

type Transporter = nodemailer.Transporter<SMTPPool.SentMessageInfo | SMTPTransport.SentMessageInfo>

class MailHandler {
    transporter: Transporter | null = null
    resolveSetup: (value?: unknown) => void = () => {}
    waitForSetup = new Promise((resolve) => { this.resolveSetup = resolve })
    testAccount: nodemailer.TestAccount | null = null

    queue: Mail.Options[] = []

    constructor() {
        this.setup()
    }

    async getTransporter(): Promise<Transporter> {
        if (this.transporter) {
            return this.transporter
        }

        await this.waitForSetup
        if (!this.transporter) {
            throw new Error('Transporter is not set after setup, this should never happen.')
        }

        return this.transporter
    }

    async setup() {
        await this.setupTransporter()

        const transporter = await this.getTransporter()

        transporter.on('idle', async () => await this.handleNewMail())
    }

    async setupTransporter() {
        if (PROD) {
            this.transporter = nodemailer.createTransport(TRANSPORT_OPTIONS)
            this.resolveSetup()
            console.log('Email setup in production')
            return
        }

        this.testAccount = await nodemailer.createTestAccount()

        this.transporter = nodemailer.createTransport({
            pool: true,
            host: 'smtp.ethereal.email',
            port: 587,
            secure: false,
            auth: {
                user: this.testAccount.user, // generated ethereal user
                pass: this.testAccount.pass // generated ethereal password
            }
        })

        this.resolveSetup()
        console.log('Email setup in development. Test account details:')
        console.log(this.testAccount)
    }

    async getTestAccount(): Promise<nodemailer.TestAccount> {
        if (PROD) {
            throw new Error('TestAccount should only be used in development')
        }

        if (this.testAccount) {
            return this.testAccount
        }

        await this.waitForSetup

        if (!this.testAccount) {
            throw new Error('Test account ins not set after setup, this should never happen.')
        }

        return this.testAccount
    }

    async handleNewMail() {
        const transporter = await this.getTransporter()

        const responsePromises = []

        while (transporter.isIdle() && this.queue.length) {
            const nextMail = this.queue.shift()
            if (nextMail) {
                responsePromises.push(transporter.sendMail(nextMail))
            }
        }

        const responses = await Promise.all(responsePromises)

        responses.forEach(r => {
            console.log(`MAIL SENT: ${r.envelope.from} -> (${r.envelope.to.join(' ')})`)
            console.log(r.response)

            if (!PROD) {
                console.log(`Preview: ${nodemailer.getTestMessageUrl(r as SMTPTransport.SentMessageInfo)}`)
            }
        })
    }

    async sendSingleMail(data: Mail.Options) {
        await this.sendBulkMail([data])
    }

    async sendBulkMail(data: Mail.Options[]) {
        const testSender = PROD ? null : (await this.getTestAccount()).user

        const queue = data
            .map(d => ({
                ...d,
                from: testSender ?? d.from,
            }))

        this.queue.push(...queue)

        await this.handleNewMail()
    }
}

export const mailHandler = new MailHandler()
