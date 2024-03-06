import { PrismaClient as PrismaClientVeven } from '@/generated/veven'
import type { PrismaClient as PrismaClientPn } from '@/generated/pn'
import migrateOmbul from './migrateOmbul'
import migrateImageCollection from './migrateImageCollection'
import migrateImage from './migrateImage'
import { getLimits } from './migrationLimits'

export default async function dobbelOmega(pnPrisma: PrismaClientPn) {
    console.log('dobbel omega!!!')
    const vevenPrisma = new PrismaClientVeven()

    const limits = getLimits()

    const imageCollectionIdMap = await migrateImageCollection(pnPrisma, vevenPrisma)
    const imageIdMap = await migrateImage(pnPrisma, vevenPrisma, imageCollectionIdMap, limits)
    await migrateOmbul(pnPrisma, vevenPrisma, imageIdMap, limits)

    console.log('dobbel omega done, dagen derpå')
}