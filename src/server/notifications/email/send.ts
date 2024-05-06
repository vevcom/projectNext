import 'server-only'
import { mailHandler } from './mailHandler'
import type Mail from 'nodemailer/lib/mailer'

export async function sendMail(rawdata: Mail.Options) {
    await mailHandler.sendSingleMail(rawdata)
}

export async function sendBulkMail(rawdata: Mail.Options[]) {
    await mailHandler.sendBulkMail(rawdata)
}
