import { PrismaClient as PrismaClientPn } from '@/generated/pn'
import { PrismaClient as PrismaClientVeven } from '@/generated/veven'
import type { IdMapper } from './migrateImageCollection'
import migrateImageCollection from './migrateImageCollection'

/**
 * This function migrates images from Veven to PN and adds them to the correct image collection
 * If they do not belong to a image collection (group on veven) they will be added to a garbage collection
 * The function also places special images like the once related to a ombul or profile picture in the correct special collection.
 * @param pnPrisma - PrismaClientPn
 * @param vevenPrisma - PrismaClientVeven
 * @param migrateImageCollectionIdMap - IdMapper - A map of the old and new id's of the image collections also
 * the same as the return value of migrateImageCollection
 */
export default async function migrateImage(
    pnPrisma: PrismaClientPn, 
    vevenPrisma: PrismaClientVeven,
    migrateImageCollectionIdMap: IdMapper
) {
    const gabageCollection = await pnPrisma.imageCollection.upsert({
        where: {
            name: 'Garbage'
        },
        update: {},
        create: {
            name: 'Søppel fra Veven',
            description: 'Denne samlingen inneholder bilder som ikke tilhører noen samling',
        }
    })

    //
    const ombulImages = await vevenPrisma.images.findMany({
        where: {
            OmbulId: 
        }
    })

    const images = await vevenPrisma.images.findMany()
}