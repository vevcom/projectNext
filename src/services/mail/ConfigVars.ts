import { isBuildPhase } from '@/lib/isBuildPhase'
import { ServerError } from '@/services/error'


export const validMailAdressDomains = isBuildPhase() ? ['omega.ntnu.no'] : (() => {
    if (!process.env.DOMAIN || !process.env.MAIL_DOMAIN) {
        throw new ServerError('INVALID CONFIGURATION', 'The environment variables DOMAIN and MAIL_DOMAIN must be set')
    }
    return [
        process.env.DOMAIN,
        process.env.MAIL_DOMAIN
    ] as const
})()
