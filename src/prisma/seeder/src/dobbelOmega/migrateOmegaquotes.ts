import manifest from '@/seeder/src/logger'
import type { UserMigrator } from './migrateUsers'
import type { PrismaClient as PrismaClientPn } from '@prisma/client'
import type { PrismaClient as PrismaClientVeven } from '@/prisma-dobbel-omega/client'
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
    userMigrator: UserMigrator,
    limits: Limits
) {
    const omegaquotes = await vevenPrisma.quotes.findMany({
        take: limits.omegaquotes ? limits.omegaquotes : undefined,
    })

    // Remove all quotes without a PosterId.
    // There exists no quotes without a PosterId in the database, except three tests
    const omegaquotesWithPosterId = omegaquotes.filter(quote => quote.PosterId)
    const data: {
        quote: string
        author: string
        timestamp: Date
        userPosterId: number
    }[] = []

    for (const quote of omegaquotesWithPosterId) {
        if (!quote.PosterId) continue

        const pnPosterId = await userMigrator.getPnUserId(quote.PosterId)
        if (!pnPosterId) {
            manifest.error(`Failed to migrate omegaquote ${quote.id} because no user with id ${quote.PosterId} exists`)
            continue
        }

        data.push({
            quote: quote.quote,
            author: quote.author,
            timestamp: quote.timestamp || new Date(),
            userPosterId: pnPosterId,
        })
    }

    await pnPrisma.omegaQuote.createMany({
        data
    })

    //TODO: also seed bulshit into omegaquote
}
