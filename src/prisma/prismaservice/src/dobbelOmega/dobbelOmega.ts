import { PrismaClient as PrismaClientVeven } from '@/generated/veven'
import type { PrismaClient as PrismaClientPn } from '@/generated/pn'
import migrateOmbul from './migrateOmbul'
import migrateImageCollections from './migrateImageCollections'
import migrateImages from './migrateImages'
import { getLimits } from './migrationLimits'
import migrateOmegaquotes from './migrateOmegaquotes'

export default async function dobbelOmega(pnPrisma: PrismaClientPn) {
    console.log('dobbel omega!!!')
    const vevenPrisma = new PrismaClientVeven()

    const limits = getLimits()

    const imageCollectionIdMap = await migrateImageCollections(pnPrisma, vevenPrisma)
    const imageIdMap = await migrateImages(pnPrisma, vevenPrisma, imageCollectionIdMap, limits)
    await migrateOmbul(pnPrisma, vevenPrisma, imageIdMap, limits)
    await migrateOmegaquotes(pnPrisma, vevenPrisma, limits)

    console.log('dobbel omega done, dagen derpå')
}