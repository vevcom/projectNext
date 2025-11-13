import migrateOmbul from './migrateOmbul'
import migrateImageCollections from './migrateImageCollections'
import migrateImages from './migrateImages'
import { getLimits } from './migrationLimits'
import migrateOmegaquotes from './migrateOmegaquotes'
import migrateArticles from './migateArticles'
import migrateMailAliases from './migrateMailAlias'
import migrateEvents from './migrateEvents'
import { UserMigrator } from './migrateUsers'
import migrateCommittees from './migrateCommittees'
import seedProdPermissions from './seedProdPermissions'
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

    const userMigrator = new UserMigrator(pnPrisma, vevenPrisma, imageIdMap)
    await userMigrator.initSpecialGroups()
    await userMigrator.migrateUsers(limits)

    await migrateOmbul(pnPrisma, vevenPrisma, imageIdMap, limits)
    await migrateOmegaquotes(pnPrisma, vevenPrisma, userMigrator, limits)
    await migrateArticles(pnPrisma, vevenPrisma, imageIdMap, limits)
    await migrateMailAliases(pnPrisma, vevenPrisma, limits)
    await migrateCommittees(pnPrisma, vevenPrisma, userMigrator)
    await migrateEvents(pnPrisma, vevenPrisma, imageIdMap, userMigrator, limits)

    await seedProdPermissions(pnPrisma)

    vevenPrisma.$disconnect()
    manifest.info('=======Dobbel Omega ferdig, dagen derpå=======')
}
