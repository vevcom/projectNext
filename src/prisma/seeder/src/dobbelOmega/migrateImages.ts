import { vevenIdToPnId, type IdMapper } from './IdMapper'
import manifest from '@/seeder/src/logger'
import { imageSizes, imageStoreLocation } from '@/seeder/src/seedImages'
import { v4 as uuid } from 'uuid'
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'
import type { Limits } from './migrationLimits'
import type { PrismaClient as PrismaClientPn } from '@prisma/client'
import type { PrismaClient as PrismaClientVeven } from '@/prisma-dobbel-omega/client'

/**
 * This function migrates images from Veven to PN and adds them to the correct image collection
 * If they do not belong to a image collection (group on veven)
 * they will be added to a garbage collection. The function also places special images
 * like the once related to a ombul or profile picture in the correct special collection.
 * @param pnPrisma - PrismaClientPn
 * @param vevenPrisma - PrismaClientVeven
 * @param migrateImageCollectionIdMap - IdMapper - A map of the old and new id's of the image collections also
 * @param limits - Limits - used to limit the number of images to migrate
 * the same as the return value of migrateImageCollection
 * @returns - A map of the old and new id's of the images to be used to create correct relations
 */
export default async function migrateImages(
    pnPrisma: PrismaClientPn,
    vevenPrisma: PrismaClientVeven,
    migrateImageCollectionIdMap: IdMapper,
    limits: Limits
) {
    const garbageCollection = await pnPrisma.imageCollection.upsert({
        where: {
            name: 'Garbage'
        },
        update: {},
        create: {
            name: 'Søppel fra Veven',
            description: 'Denne samlingen inneholder bilder som ikke tilhører noen samling',
            visibility: {
                create: {
                    purpose: 'IMAGE',
                    published: true,
                    regularLevel: {
                        create: {}
                    },
                    adminLevel: {
                        create: {}
                    },
                }
            }
        },
    })

    const ombulCollection = await pnPrisma.imageCollection.findUnique({
        where: {
            special: 'OMBULCOVERS',
        },
    })
    if (!ombulCollection) throw new Error('No ombul collection found for seeding images')

    const profileCollection = await pnPrisma.imageCollection.findUnique({
        where: {
            special: 'PROFILEIMAGES',
        },
    })
    if (!profileCollection) throw new Error('No profile collection found for seeding images')

    const images = await vevenPrisma.images.findMany({
        include: {
            Ombul: true,
            Articles: true,
            Events: true,
        }
    })

    // Find what the profile collection is on veven
    const vevenProfileCollection = await vevenPrisma.imageGroups.findFirstOrThrow({
        where: {
            name: 'Profilbilder',
        },
    })

    manifest.info(`Before filter: ${images.length} images`)
    const imagesWithCollection = images.map(image => {
        let collectionId = vevenIdToPnId(migrateImageCollectionIdMap, image.ImageGroupId)
        if (image.Ombul.length) {
            collectionId = ombulCollection.id
        } else if (!collectionId) {
            collectionId = garbageCollection.id
        } else if (image.ImageGroupId === vevenProfileCollection.id) {
            collectionId = profileCollection.id
        }
        return {
            ...image,
            collectionId,
        }
    }).filter(image => {
        //Apply limits
        if (limits.numberOffFullImageCollections === null) return true
        if (image.Ombul.length) return true
        if (image.Articles.length) return true
        if (image.Events.length) return true
        if (image.collectionId === ombulCollection.id) return true
        if (image.collectionId === profileCollection.id) return true
        if (image.ImageGroupId && image.ImageGroupId < limits.numberOffFullImageCollections) return true
        return false
    })
    manifest.info(`After filter: ${imagesWithCollection.length} images`)

    const imagesWithCollectionAndFs = await fetchAllImagesAndUploadToStore(imagesWithCollection)

    //correct names if there are duplicates
    const namesTaken: { name: string, times: number }[] = []
    const imagesWithCollectionAndFsAndCorrectedName = imagesWithCollectionAndFs.map(image => {
        if (!image) return null //Only happens if fetchImageAndUploadToStore fails for the image
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
        }
        namesTaken.push({ name, times: 0 })

        return {
            ...image,
            name,
            ext
        }
    })

    //Finally upsurt to db
    const migrateImageIdMap: IdMapper = []
    await Promise.all(imagesWithCollectionAndFsAndCorrectedName.map(async image => {
        if (!image) return //Only happens if fetchImageAndUploadToStore fails for the image
        const { id: pnId } = await pnPrisma.image.upsert({
            where: {
                id: image.id
            },
            update: {},
            create: {
                name: image.name,
                alt: image.name.split('_').join(' '),
                fsLocationOriginal: image.fsLocationOriginal,
                fsLocationLargeSize: image.fsLocationLargeSize,
                fsLocationSmallSize: image.fsLocationSmallSize,
                fsLocationMediumSize: image.fsLocationMediumSize,
                extOriginal: image.ext,
                collection: {
                    connect: {
                        id: image.collectionId
                    }
                }
            }
        })
        migrateImageIdMap.push({ vevenId: image.id, pnId })
    }))
    return migrateImageIdMap
}

type Locations = {
    fsLocationOriginal: string,
    fsLocationSmallSize: string,
    fsLocationMediumSize: string,
    fsLocationLargeSize: string
}

async function fetchAllImagesAndUploadToStore<X extends {
    originalName: string,
    name: string,
    id: number
}>(images: X[]): Promise<((X & Locations) | null)[]> {
    const ret: ((X & Locations) | null)[] = []
    let imageCounter = 1
    const batchSize = 1200
    const imageBatches = images.reduce((acc, image) => {
        if (acc[acc.length - 1].length >= batchSize) {
            acc.push([image])
        } else {
            acc[acc.length - 1].push(image)
        }
        return acc
    }, [[]] as X[][])

    const uploadOne = async (image: X) => {
        manifest.info(`Migrating image number ${imageCounter++} of ${images.length}`)
        const ext = image.originalName.split('.').pop() || ''
        const fsLocationDefaultOldVev = `${process.env.VEVEN_STORE_URL}/image/default/${image.name}`
            + `?url=/store/images/${image.name}.${ext}`
        const fsLocationMediumOldVev = `${process.env.VEVEN_STORE_URL}/image/resize/${imageSizes.medium}/`
            + `${imageSizes.medium}/${image.name}?url=/store/images/${image.name}.${ext}`
        const fsLocationSmallOldVev = `${process.env.VEVEN_STORE_URL}/image/resize/${imageSizes.small}/`
            + `${imageSizes.small}/${image.name}?url=/store/images/${image.name}.${ext}`
        const fsLocationLargeOldVev = `${process.env.VEVEN_STORE_URL}/image/resize/${imageSizes.large}/`
            + `${imageSizes.large}/${image.name}?url=/store/images/${image.name}.${ext}`
        const fsLocationOriginal = await fetchImageAndUploadToStore(fsLocationDefaultOldVev)
        const fsLocationMediumSize = await fetchImageAndUploadToStore(fsLocationMediumOldVev)
        const fsLocationSmallSize = await fetchImageAndUploadToStore(fsLocationSmallOldVev)
        const fsLocationLargeSize = await fetchImageAndUploadToStore(fsLocationLargeOldVev)
        if (!fsLocationOriginal || !fsLocationMediumSize || !fsLocationSmallSize || !fsLocationLargeSize) {
            console.error(`Failed to fetch image from ${fsLocationDefaultOldVev}`)
            ret.push(null)
        } else {
            ret.push({
                ...image,
                fsLocationSmallSize,
                fsLocationMediumSize,
                fsLocationOriginal,
                fsLocationLargeSize
            })
        }
    }


    for (const imageBatch of imageBatches) {
        await Promise.all(imageBatch.map(uploadOne))
    }
    return ret
}

/**
 * fetches an image from the Veven store and uploads it to the PN store (does NOT store the image
 * in the database, only the file on the server). Note that veven will often fail when we make a
 * lot of requests to it. TODO: Add a retry mechanism
 * @param fsLocationVev - The location of the image on the Veven store to be fetched
 * @returns - The location of the image on the PN store
 */
async function fetchImageAndUploadToStore(fsLocationVev: string): Promise<string | null> {
    const ext = fsLocationVev.split('.').pop()
    const fsLocationPn = `${uuid()}.${ext}`

    if (!ext || !['webp', 'png', 'jpg', 'jpeg', 'svg'].includes(ext)) {
        console.error(`Image ${fsLocationVev} is not a suported image`)
        return null
    }
    const res = await fetch(fsLocationVev, {
        method: 'GET',
        //This is to make the fetch request look like it comes from a browser. Not sure if it helps
        headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
                + 'AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3',
        },
    }).catch(() => console.error(`Failed to fetch image from ${fsLocationVev}`))

    if (!res) return null
    const imageBuffer = Buffer.from(await res.arrayBuffer())
    await mkdir(imageStoreLocation, { recursive: true })
    await writeFile(join(imageStoreLocation, fsLocationPn), imageBuffer)
    return fsLocationPn
}
