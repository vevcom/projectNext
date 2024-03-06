import type { PrismaClient as PrismaClientPn } from '@/generated/pn'
import type { PrismaClient as PrismaClientVeven } from '@/generated/veven'
import type { Limits } from './migrationLimits'

/**
 * This function migrates omegaquotes from Veven to PN
 * @param pnPrisma - PrismaClientPn
 * @param vevenPrisma - PrismaClientVeven
 * @param limits - Limits - used to limit the number of quotes to migrate
 */
export default async function migrateOmegaquotes(
    pnPrisma: PrismaClientPn,
    vevenPrisma: PrismaClientVeven,
    limits: Limits
) {
    const omegaquotes = await vevenPrisma.quotes.findMany({
        take: limits.omegaquotes ? limits.omegaquotes : undefined,
    })
    await pnPrisma.omegaQuote.createMany({
        data: omegaquotes.map(quote => {
            return {
                quote: quote.quote,
                author: quote.author,
                timestamp: quote.timestamp || new Date(),
                userPosterId: 0,
            }
        })
    })

    //TODO: link to a user??? user migration not done yet
    //TODO: also seed bulshit into omegaquote
}
