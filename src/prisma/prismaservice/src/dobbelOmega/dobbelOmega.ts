import { PrismaClient as PrismaClientVeven } from '@/generated/veven'
import type { PrismaClient as PrismaClientPn } from '@/generated/pn'
import migrateOmbul from './migrateOmbul'
import migrateImageCollection from './migrateImageCollection'
import migrateImage from './migrateImage'

export default async function dobbelOmega(pnPrisma: PrismaClientPn) {
    const vevenPrisma = new PrismaClientVeven()
    const imageCollectionIdMap = await migrateImageCollection(pnPrisma, vevenPrisma)
    await migrateImage(pnPrisma, vevenPrisma)
    await migrateOmbul(pnPrisma, vevenPrisma)
}