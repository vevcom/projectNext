import { ServerError } from '@/server/error'

if (!process.env.DOMAIN || !process.env.MAIL_DOMAIN) {
    throw new ServerError('INVALID CONFIGURATION', 'The environment variables DOMAIN and MAIL_DOMAIN must be set')
}

export const validMailAdressDomains = [
    process.env.DOMAIN,
    process.env.MAIL_DOMAIN
] as const

