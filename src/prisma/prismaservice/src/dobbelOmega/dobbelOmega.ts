import migrateOmbul from './migrateOmbul'
import migrateImageCollections from './migrateImageCollections'
import migrateImages from './migrateImages'
import { getLimits } from './migrationLimits'
import migrateOmegaquotes from './migrateOmegaquotes'
import migrateArticles from './migateArticles'
import migrateMailAliases from './migrateMailAlias'
import { PrismaClient as PrismaClientVeven } from '@/generated/veven'
import type { PrismaClient as PrismaClientPn } from '@/generated/pn'

/**
 * !DobbelOmega!
 * This function migrates data from Veven to ProjectNext
 * @param pnPrisma - PrismaClientPn
 */
export default async function dobbelOmega(pnPrisma: PrismaClientPn) {
    console.log('============================================')
    console.log('==========!!!Dobbel Omega!!!================')
    const vevenPrisma = new PrismaClientVeven()

    const limits = getLimits()

    const imageCollectionIdMap = await migrateImageCollections(pnPrisma, vevenPrisma)
    const imageIdMap = await migrateImages(pnPrisma, vevenPrisma, imageCollectionIdMap, limits)
    await migrateOmbul(pnPrisma, vevenPrisma, imageIdMap, limits)
    await migrateOmegaquotes(pnPrisma, vevenPrisma, limits)
    await migrateArticles(pnPrisma, vevenPrisma, imageIdMap, limits)
    await migrateMailAliases(pnPrisma, vevenPrisma, limits)

    vevenPrisma.$disconnect()
    console.log('=======Dobbel Omega ferdig, dagen derpå=======')
}
