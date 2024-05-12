import 'server-only'
import { mailHandler } from './mailHandler'
import type Mail from 'nodemailer/lib/mailer'

export async function sendMail(rawdata: Mail.Options) {
    await mailHandler.sendSingleMail(rawdata)
}

export async function sendBulkMail(rawdata: Mail.Options[]) {
    await mailHandler.sendBulkMail(rawdata)
}


/**
 * Sends a system email. Must not be used as a notification.
 * This sends an email to one user, due to some system event, such as forgot password.
 * 
 * @param to - The recipient's email address.
 * @param subject - The subject of the email.
 * @param body - The body of the email.
 */
export async function sendSystemMail(
    to: string,
    subject: string,
    body: string,
) {
    await sendMail({
        to,
        subject,
        from: `noreply@${process.env.DOMAIN}`,
        html: body,
    })
}