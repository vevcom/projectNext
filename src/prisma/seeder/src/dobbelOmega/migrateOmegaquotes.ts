import { vevenIdToPnId } from './IdMapper'
import logger from '@/seeder/src/logger'
import type { IdMapper } from './IdMapper'
import type { PrismaClient as PrismaClientPn } from '@prisma/client'
import type { PrismaClient as PrismaClientVeven, Quotes } from '@/prisma-dobbel-omega/client'
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
    userIdMap: IdMapper,
    limits: Limits
) {
    const omegaquotes = await vevenPrisma.quotes.findMany({
        take: limits.omegaquotes ? limits.omegaquotes : undefined,
    })

    // Remove all quotes without a PosterId.
    // There exists no quotes without a PosterId in the database, except three tests
    const omegaquoteFiltered = omegaquotes.reduce((acc, quote) => {
        const PosterId = quote.PosterId
        if (PosterId) {
            acc.push({ ...quote, PosterId })
        } else {
            logger.warn('Quote without PosterId found', quote)
        }
        return acc
    }, [] as (Quotes & { PosterId: number })[]).reduce((acc, quote) => {
        const pnPosterId = vevenIdToPnId(userIdMap, quote.PosterId)
        if (!pnPosterId) {
            logger.warn(`No user in PN found for quote - was the user with vevenId ${quote.PosterId} migrated`, quote)
            return acc
        }
        acc.push({ ...quote, PosterId: pnPosterId })
        return acc
    }, [] as (Quotes & { PosterId: number })[])

    await pnPrisma.omegaQuote.createMany({
        data: omegaquoteFiltered.map(quote => ({
            quote: quote.quote,
            author: quote.author,
            timestamp: quote.timestamp || new Date(),
            userPosterId: quote.PosterId,
        })),
    })

    //TODO: also seed bulshit into omegaquote
}
