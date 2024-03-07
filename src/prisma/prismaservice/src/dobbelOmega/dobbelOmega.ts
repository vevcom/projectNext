import migrateOmbul from './migrateOmbul'
import migrateImageCollections from './migrateImageCollections'
import migrateImages from './migrateImages'
import { getLimits } from './migrationLimits'
import migrateOmegaquotes from './migrateOmegaquotes'
import type { PrismaClient as PrismaClientPn } from '@/generated/pn'
import { PrismaClient as PrismaClientVeven } from '@/generated/veven'
import migrateArticles from './migateArticles'

/**
 * !DobbelOmega!
 * This function migrates data from Veven to ProjectNext
 * @param pnPrisma - PrismaClientPn
 */
export default async function dobbelOmega(pnPrisma: PrismaClientPn) {
    console.log('dobbel omega!!!')
    const vevenPrisma = new PrismaClientVeven()

    const limits = getLimits()

    const imageCollectionIdMap = await migrateImageCollections(pnPrisma, vevenPrisma)
    const imageIdMap = await migrateImages(pnPrisma, vevenPrisma, imageCollectionIdMap, limits)
    await migrateOmbul(pnPrisma, vevenPrisma, imageIdMap, limits)
    await migrateOmegaquotes(pnPrisma, vevenPrisma, limits)
    await migrateArticles(pnPrisma, vevenPrisma, imageIdMap, limits)

    vevenPrisma.$disconnect()
    console.log('dobbel omega done, dagen derpå')
}
