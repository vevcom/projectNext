import { PrismaClient as PrismaClientPn } from '@/generated/pn'
import { PrismaClient as PrismaClientVeven } from '@/generated/veven'
import type { IdMapper } from './migrateImageCollection'
import { imageSizes, imageStoreLocation } from 'src/seedImages'
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'
import { v4 as uuid } from 'uuid'

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
        },
    })

    const ombulcollection = await pnPrisma.imageCollection.findUnique({
        where: {
            special: 'OMBULCOVERS',
        },
    })
    if (!ombulcollection) throw new Error('No ombul collection found for seeding images')

    const images = await vevenPrisma.images.findMany({
        include: {
            Ombul: true
        }
    })

    const imagesWithCollection = images.map(image => {
        let collectionId = migrateImageCollectionIdMap.find(collection => collection.vevenId === image.ImageGroupId)?.pnId
        if (image.Ombul.length) {
            collectionId = ombulcollection.id
        } else if (!collectionId) {
            collectionId = gabageCollection.id
        } 
        return {
            ...image,
            collectionId,
        }
    })

    console.log(imagesWithCollection.splice(0, 10))
    await Promise.all(imagesWithCollection.map(async (image) => {
        const ext = image.name.split('.')[1]
        const fsLocationDefaultOldVev = `${process.env.VEVEN_STORE_URL}/image/default/${image.name}/
            ?url=${process.env.VEVEN_STORE_URL}/images/${image.name}.${ext}`
        const fsLocationMediumOldVev = `${process.env.VEVEN_STORE_URL}/image/
            resize/${imageSizes.medium}/${imageSizes.medium}/${image.name}
            ?url=${process.env.VEVEN_STORE_URL}/images/${image.name}.${ext}`
        const fsLocationSmallOldVev = `${process.env.VEVEN_STORE_URL}/image/
            resize/${imageSizes.small}/${imageSizes.small}/${image.name}
            ?url=${process.env.VEVEN_STORE_URL}/images/${image.name}.${ext}`
    }))
}

/**
 * fetches an image from the Veven store and uploads it to the PN store (does NOT store the image 
 * in the database, only the file on the server)
 * @param fsLocationVev - The location of the image on the Veven store to be fetched
 * @returns - The location of the image on the PN store
 */
async function fetchImageAndUploadToStore(fsLocationVev: string) : Promise<string> {
    const ext = fsLocationVev.split('.').pop()
    const fsLocationPn = `${uuid()}.${ext}`

    const res = await fetch(fsLocationVev, {
        method: 'GET',
    })
    const imageBuffer = Buffer.from(await res.arrayBuffer())
    await mkdir(imageStoreLocation, { recursive: true })
    await writeFile(join(imageStoreLocation, fsLocationPn), imageBuffer)
    return fsLocationPn
}