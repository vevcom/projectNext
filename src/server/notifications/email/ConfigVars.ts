import 'server-only'

import SMTPPool from "nodemailer/lib/smtp-pool"


export const DEFAULT_SENDER_ALIAS = "noreply" + process.env.DOMAIN

// This configurastion is only used the production. Othervise ethereal is used
export const TRANSPORT_OPTIONS: SMTPPool.Options = {
    pool: true,
    maxConnections: 20, // default is 5, I think sanctus is very fast to maybe this will work :))
    host: process.env.MAIL_SERVER,
    port: 25,
    secure: false,
}