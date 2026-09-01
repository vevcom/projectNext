import { owIdToPnId, type IdMapper } from './IdMapper'
import manifest from '@/seeder/src/logger'
import { imageOperations } from '@/services/images/subservice/operations'
import { allowedExtensions } from '@/services/images/subservice/constants'
import { mimeTypeForExtension } from '@/lib/store/fileExtensions'
import { ombulCoversImagePanelOperations } from '@/services/ombul/ombulCoverCollection'
import { profileImagesImagePanelOperations } from '@/services/users/profileImageCollection'
import { committeeLogosImagePanelOperations } from '@/services/groups/committees/committeeLogoCollection'
import { File } from 'node:buffer'
import type { Limits } from './migrationLimits'
import type { PrismaClient as PrismaClientPn } from '@/prisma-generated-pn-client'
import type { PrismaClient as PrismaClientOw } from '@/prisma-generated-ow-basic/client'

/**
 * This function migrates images from Omegaweb-basic to PN and adds them to the correct image collection
 * If they do not belong to a image collection (group on Omegaweb-basic)
 * they will be added to a garbage collection. The function also places special images
 * like the once related to a ombul, profile picture, or committee logo in the correct special collection.
 *
 * Only the original file is fetched from Omegaweb-basic - imageOperations.uploadImage takes care of
 * generating the small/medium/large avif sizes and storing everything, same as a live upload would.
 * @param pnPrisma - PrismaClientPn
 * @param owPrisma - PrismaClientOw
 * @param migrateImageCollectionIdMap - IdMapper - A map of the old and new id's of the image collections also
 * @param limits - Limits - used to limit the number of images to migrate
 * the same as the return value of migrateImageCollection
 * @returns - A map of the old and new id's of the images to be used to create correct relations
 */
export default async function migrateImages(
    pnPrisma: PrismaClientPn,
    owPrisma: PrismaClientOw,
    migrateImageCollectionIdMap: IdMapper,
    limits: Limits
) {
    const garbageCollection = await pnPrisma.imageCollection.upsert({
        where: {
            name: 'Garbage'
        },
        update: {},
        create: {
            name: 'Søppel fra Omegaweb-basic',
            description: 'Denne samlingen inneholder bilder som ikke tilhørete noen samling i omegaweb-basic',
            visibilityRegular: {
                create: {},
            },
            visibilityAdmin: {
                create: {} //TODO: Require vevcom or something...
            }
        },
    })

    // Reads (and, if missing, creates from config) each special collection through its real
    // implementation, same as the live app uses - rather than assuming it already exists.
    const ombulCollection = await ombulCoversImagePanelOperations.readCollection({ prisma: pnPrisma, bypassAuth: true })
    const profileCollection = await profileImagesImagePanelOperations.readCollection({ prisma: pnPrisma, bypassAuth: true })
    const committeeLogosCollection = await committeeLogosImagePanelOperations.readCollection({
        prisma: pnPrisma, bypassAuth: true
    })

    const images = await owPrisma.images.findMany({
        include: {
            Ombul: true,
            Articles: true,
            Events: true,
        }
    })

    // Find what the profile collection is on omegaweb-basic
    const omegawebBasicProfileCollection = await owPrisma.imageGroups.findFirstOrThrow({
        where: {
            name: 'Profilbilder',
        },
    })

    // Committees.ImageId has no back-relation on Images, so committee logos can't be picked up via an
    // include like Ombul/Articles/Events below - fetched separately so they're exempted from limits too,
    // same as ombul covers and profile pictures. Otherwise migrateCommittees can silently end up with no
    // logo for a committee whose image got filtered out here under a limited/dev migration.
    const committees = await owPrisma.committees.findMany({
        select: { ImageId: true },
    })
    const committeeImageIds = new Set(
        committees.flatMap(committee => (committee.ImageId ? [committee.ImageId] : []))
    )

    manifest.info(`Before filter: ${images.length} images`)
    const imagesWithCollection = images.map(image => {
        let collectionId = owIdToPnId(migrateImageCollectionIdMap, image.ImageGroupId)
        if (image.Ombul.length) {
            collectionId = ombulCollection.id
        } else if (committeeImageIds.has(image.id)) {
            collectionId = committeeLogosCollection.id
        } else if (!collectionId) {
            collectionId = garbageCollection.id
        } else if (image.ImageGroupId === omegawebBasicProfileCollection.id) {
            collectionId = profileCollection.id
        }
        return {
            ...image,
            collectionId,
        }
    }).filter(image => {
        //Apply limits
        if (limits.numberOffFullImageCollections === null) return true
        if (image.Articles.length) return true
        if (image.Events.length) return true
        //Images belonging to a special collection are always migrated, regardless of limits
        if (image.collectionId === ombulCollection.id) return true
        if (image.collectionId === profileCollection.id) return true
        if (image.collectionId === committeeLogosCollection.id) return true
        if (image.ImageGroupId && image.ImageGroupId < limits.numberOffFullImageCollections) return true
        return false
    })
    manifest.info(`After filter: ${imagesWithCollection.length} images`)

    //correct names if there are duplicates. Kept separate from the OW `name` field (used to fetch the
    //file from Omegaweb-basic below) since that field is a store token, not the display name.
    const namesTaken: { name: string, times: number }[] = []
    const imagesToMigrate = limits.images ? imagesWithCollection.slice(0, limits.images) : imagesWithCollection
    const imagesWithCorrectedName = imagesToMigrate.map(image => {
        const baseName = image.originalName.split('.').slice(0, -1).join('.')
        const nameTaken = namesTaken.find(nameTakenItem => nameTakenItem.name === baseName)
        if (nameTaken) {
            nameTaken.times++
            return { ...image, pnImageName: `${baseName}(${nameTaken.times})` }
        }
        namesTaken.push({ name: baseName, times: 0 })
        return { ...image, pnImageName: baseName }
    })

    const migrateImageIdMap: IdMapper = []
    let imageCounter = 1

    const migrateOneImage = async (image: (typeof imagesWithCorrectedName)[number]) => {
        manifest.info(`Migrating image number ${imageCounter++} of ${imagesWithCorrectedName.length}`)
        const ext = (image.originalName.split('.').pop() || '').toLowerCase()
        const mimeType = mimeTypeForExtension(ext)
        if (!mimeType) {
            console.error(`Image ${image.originalName} has unsupported extension "${ext}", skipping`)
            return
        }

        const fsLocationOldVev = `${process.env.OW_STORE_URL}/image/default/${image.name}`
            + `?url=/store/images/${image.name}.${ext}`

        const res = await fetch(fsLocationOldVev, {
            method: 'GET',
            //This is to make the fetch request look like it comes from a browser. Not sure if it helps
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
                    + 'AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3',
            },
        }).catch(() => console.error(`Failed to fetch image from ${fsLocationOldVev}`))

        if (!res || !res.ok) {
            console.error(`Failed to fetch image from ${fsLocationOldVev}`)
            return
        }

        const buffer = Buffer.from(await res.arrayBuffer())
        const imageFile = new File([new Uint8Array(buffer)], `${image.pnImageName}.${ext}`, { type: mimeType })

        const pnImage = await imageOperations.uploadImage.internalCall({
            prisma: pnPrisma,
            params: { collectionId: image.collectionId },
            data: {
                imageFile,
                imageName: image.pnImageName.slice(0, 50),
                imageAlt: image.pnImageName.split('_').join(' ').slice(0, 100),
            },
            operationImplementationFields: {
                uploadAsStandardImage: null,
                // Deliberately the full set rather than the per-collection subset: this migrates
                // what omegaweb-basic already has, including committee logos, raster over there.
                allowedExtensions,
            },
        })

        migrateImageIdMap.push({ owId: image.id, pnId: pnImage.id })
    }

    //Batched to avoid hammering omegaweb-basic with too many concurrent requests at once
    const batchSize = 1200
    const imageBatches: (typeof imagesWithCorrectedName)[] = [[]]
    for (const image of imagesWithCorrectedName) {
        if (imageBatches[imageBatches.length - 1].length >= batchSize) {
            imageBatches.push([image])
        } else {
            imageBatches[imageBatches.length - 1].push(image)
        }
    }
    for (const imageBatch of imageBatches) {
        await Promise.all(imageBatch.map(migrateOneImage))
    }

    return migrateImageIdMap
}
