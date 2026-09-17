import '@pn-server-only'

import type SMTPPool from 'nodemailer/lib/smtp-pool'


export const DEFAULT_NOTIFICATION_ALIAS = 'noreply@omega.ntnu.no'

// This configurastion is only used the production. Othervise ethereal is used
export const TRANSPORT_OPTIONS: SMTPPool.Options = {
    pool: true,
    maxConnections: 20, // default is 5, I think sanctus is very fast to maybe this will work :))
    host: process.env.MAIL_SERVER,
    port: 25,
    secure: false,
}
