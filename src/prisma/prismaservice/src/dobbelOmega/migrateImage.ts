import { PrismaClient as PrismaClientPn } from '@/generated/pn'
import { PrismaClient as PrismaClientVeven } from '@/generated/veven'
import { vevenIdToPnId, type IdMapper } from './IdMapper'
import { imageSizes, imageStoreLocation } from '@/src/seedImages'
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
 * @returns - A map of the old and new id's of the images to be used to create correct relations
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

    const ombulCollection = await pnPrisma.imageCollection.findUnique({
        where: {
            special: 'OMBULCOVERS',
        },
    })
    if (!ombulCollection) throw new Error('No ombul collection found for seeding images')

    const images = await vevenPrisma.images.findMany({
        include: {
            Ombul: true
        }
    })

    const imagesWithCollection = images.map(image => {
        let collectionId = vevenIdToPnId(migrateImageCollectionIdMap, image.ImageGroupId);
        if (image.Ombul.length) {
            collectionId = ombulCollection.id
        } else if (!collectionId) {
            collectionId = gabageCollection.id
        } 
        return {
            ...image,
            collectionId,
        } //TODO: Remove this. For now I only want to migrate ombul images or images in foirst 5 collections on veven
    }).filter(image => image.collectionId === ombulCollection.id || image.collectionId < 5)

    const imagesWithCollectionAndFs = await Promise.all(imagesWithCollection.map(async (image) => {
        const ext = image.name.split('.')[1]
        const fsLocationDefaultOldVev = `${process.env.VEVEN_STORE_URL}/image/default/${image.name}/
            ?url=${process.env.VEVEN_STORE_URL}/images/${image.name}.${ext}`
        const fsLocationMediumOldVev = `${process.env.VEVEN_STORE_URL}/image/
            resize/${imageSizes.medium}/${imageSizes.medium}/${image.name}
            ?url=${process.env.VEVEN_STORE_URL}/images/${image.name}.${ext}`
        const fsLocationSmallOldVev = `${process.env.VEVEN_STORE_URL}/image/
            resize/${imageSizes.small}/${imageSizes.small}/${image.name}
            ?url=${process.env.VEVEN_STORE_URL}/images/${image.name}.${ext}`
        const [fsLocationSmallSize, fsLocationMediumSize, fsLocation] = await Promise.all([
            fetchImageAndUploadToStore(fsLocationSmallOldVev),
            fetchImageAndUploadToStore(fsLocationMediumOldVev),
            fetchImageAndUploadToStore(fsLocationDefaultOldVev)
        ])
        return {
            ...image,
            fsLocationSmallSize,
            fsLocationMediumSize,
            fsLocation
        }
    }))

    //correct names if there are duplicates
    const namesTaken : { name: string, times: number }[] = []
    const imagesWithCollectionAndFsAndCorrectedName = imagesWithCollectionAndFs.map(image => {
        const ext = image.originalName.split('.').pop() || ''
        const name = image.originalName.split('.').slice(0, -1).join('.')
        const nameTaken = namesTaken.find(n => n.name === name)
        if (nameTaken) {
            nameTaken.times++
            return {
                ...image,
                name: `${name}(${nameTaken.times})`,
                ext
            }
        } else {
            namesTaken.push({name, times: 0})
        }
        return {
            ...image,
            name,
            ext
        }
    })

    //Finally upsurt to db
    const migrateImageIdMap : IdMapper = []
    await Promise.all(imagesWithCollectionAndFsAndCorrectedName.map(async image => {
        const { id: pnId } = await pnPrisma.image.upsert({
            where: {
                name: image.name
            },
            update: {},
            create: {
                name: image.name,
                alt: image.name.split('_').join(' '),
                fsLocation: image.fsLocation,
                fsLocationSmallSize: image.fsLocationSmallSize,
                fsLocationMediumSize: image.fsLocationMediumSize,
                ext: image.ext,
                collection: {
                    connect: {
                        id: image.collectionId
                    }
                }
            }
        })
        migrateImageIdMap.push({vevenId: image.id, pnId})
    }))
    return migrateImageIdMap
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