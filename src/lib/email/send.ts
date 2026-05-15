import '@pn-server-only'
import { getMailHandler } from './mailHandler'
import { render } from '@react-email/render'
import type React from 'react'
import type Mail from 'nodemailer/lib/mailer'

export async function sendMail(rawdata: Mail.Options) {
    await getMailHandler().sendSingleMail(rawdata)
}

export async function sendBulkMail(rawdata: Mail.Options[]) {
    await getMailHandler().sendBulkMail(rawdata)
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
    body: React.JSX.Element | string,
) {
    await sendMail({
        to,
        subject,
        from: `noreply@${process.env.DOMAIN}`,
        html: (typeof body === 'string') ? body : await render(body),
    })
}
