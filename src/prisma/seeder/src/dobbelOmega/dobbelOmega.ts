import migrateOmbul from './migrateOmbul'
import migrateImageCollections from './migrateImageCollections'
import migrateImages from './migrateImages'
import { getLimits } from './migrationLimits'
import migrateOmegaquotes from './migrateOmegaquotes'
import migrateArticles from './migateArticles'
import migrateMailAliases from './migrateMailAlias'
import migrateEvents from './migrateEvents'
import migrateUsers from './migrateUsers'
import manifest from '@/seeder/src/logger'
import { PrismaClient as PrismaClientVeven } from '@/prisma-dobbel-omega/client'
import type { PrismaClient as PrismaClientPn } from '@prisma/client'

/**
 * !DobbelOmega!
 * This function migrates data from Veven to ProjectNext
 * @param pnPrisma - PrismaClientPn
 */
export default async function dobbelOmega(pnPrisma: PrismaClientPn) {
    manifest.info('============================================')
    manifest.info('==========!!!Dobbel Omega!!!================')
    const vevenPrisma = new PrismaClientVeven()

    const limits = getLimits()

    const imageCollectionIdMap = await migrateImageCollections(pnPrisma, vevenPrisma)
    const imageIdMap = await migrateImages(pnPrisma, vevenPrisma, imageCollectionIdMap, limits)
    const userIdMap = await migrateUsers(pnPrisma, vevenPrisma, limits, imageIdMap)
    await migrateOmbul(pnPrisma, vevenPrisma, imageIdMap, limits)
    await migrateOmegaquotes(pnPrisma, vevenPrisma, userIdMap, limits)
    await migrateArticles(pnPrisma, vevenPrisma, imageIdMap, limits)
    await migrateMailAliases(pnPrisma, vevenPrisma, limits)
    await migrateEvents(pnPrisma, vevenPrisma, imageIdMap, limits)

    vevenPrisma.$disconnect()
    manifest.info('=======Dobbel Omega ferdig, dagen derpå=======')
}
