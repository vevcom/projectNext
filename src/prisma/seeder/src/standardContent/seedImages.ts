import { standardImageCollectionOperations } from '@/services/images/standard/operations'
import { StandardImage } from '@/prisma-generated-pn/enums'
import { dynamicImageOperations } from '@/services/images/dynamic/operations'
import { standardStoreFiles } from '@/lib/standardStore/files'
import { defineSeedOperation } from '@/seeder/src/defineSeedOperation'
import { upsert } from '@/seeder/src/upsert'
import type { PrismaClient } from '@/prisma-generated-pn-client'
import type { StandardStoreFile } from '@/lib/standardStore/files'

export const seedDynamicImagesForCms = [
    {
        standardStoreFile: standardStoreFiles.treaty,
        name: 'traktat',
        alt: 'En gammel traktat',
    },
    {
        standardStoreFile: standardStoreFiles.kappemann,
        name: 'kappemann',
        alt: 'En kappemann',
    },
    {
        standardStoreFile: standardStoreFiles.kongsberg,
        name: 'kongsberg',
        alt: 'Kongsberg',
    },
    {
        standardStoreFile: standardStoreFiles.nordic,
        name: 'nordic',
        alt: 'Nordic',
    },
    {
        standardStoreFile: standardStoreFiles.ohma,
        name: 'ohma',
        alt: 'Ohma (verdens beste lokomotiv)',
    },
    {
        standardStoreFile: standardStoreFiles.omegaMai,
        name: 'omega_mai',
        alt: 'Omega mai',
    },
    {
        standardStoreFile: standardStoreFiles.ov,
        name: 'ov',
        alt: 'OV',
    },
] as const satisfies {
    standardStoreFile: StandardStoreFile,
    name: string,
    alt: string,
}[]

const SEEDED_CMS_IMAGES_COLLECTION_NAME = 'seeded cms images'

/**
 * Seeds
 *
 * 1. standard images, using the standardImageCollection api - note that this is actually not strictly necessary,
 * as the standard images are generated on the fly when requested, if one uses the
 * standardImageCollection api to request them (as one should always do when wanting standard images). Each one
 * is only generated if missing - never regenerated - since standard images can be replaced through the admin
 * image system and this should never overwrite one that already exists.
 *
 * 2. A set of dynamic images, which are seeded into a dynamic collection. These are used for dynamic cms content
 * which is seeded later on. The collection and its images are likewise only created if missing.
 */
export const seedImages = defineSeedOperation(async (prisma: PrismaClient) => {
    await Promise.all([
        Promise.all(
            Object.values(StandardImage).map(standardImage => upsertStandardImage(prisma, standardImage))
        ),
        upsertSeededCmsImagesCollection(prisma),
    ])
})

async function upsertStandardImage(prisma: PrismaClient, standardImage: StandardImage) {
    return upsert({
        checkExistance: () => prisma.image.findUnique({
            where: { standardImage },
            select: { id: true }
        }),
        create: () => standardImageCollectionOperations.generateStandardImageFromConfig.internalCall({
            params: { standardImage }
        }),
        update: () => Promise.resolve(),
    })
}

async function upsertSeededCmsImagesCollection(prisma: PrismaClient) {
    const collection = await upsert({
        checkExistance: () => dynamicImageOperations.readCollection({
            params: { collectionName: SEEDED_CMS_IMAGES_COLLECTION_NAME }
        }),
        create: () => dynamicImageOperations.createCollection({
            data: {
                collectionName: SEEDED_CMS_IMAGES_COLLECTION_NAME,
                collectionDescription: 'A collection for images used for seeded cms content',
            }
        }),
        update: () => dynamicImageOperations.readCollection({
            params: { collectionName: SEEDED_CMS_IMAGES_COLLECTION_NAME }
        }),
    })

    await Promise.all(
        seedDynamicImagesForCms.map(imageConfig => upsertDynamicImageForCms(prisma, collection.id, imageConfig))
    )
}

async function upsertDynamicImageForCms(
    prisma: PrismaClient,
    collectionId: number,
    imageConfig: typeof seedDynamicImagesForCms[number]
) {
    return upsert({
        checkExistance: () => prisma.image.findFirst({
            where: { collectionId, name: imageConfig.name },
            select: { id: true }
        }),
        create: async () => dynamicImageOperations.uploadImage({
            data: await imageConfig.standardStoreFile.imageUploadData({
                name: imageConfig.name,
                alt: imageConfig.alt
            }),
            params: { collectionId }
        }),
        update: () => Promise.resolve(),
    })
}

/**
 * After seeding of the images is - both standard images and dynamic images we expose a type
 * declearing which images can be used in the seeding of the cms content later in the seeding pipeline.
 */
export type ImagesAvailablieForCms = {
    dynamicImageSeededForCmsName: typeof seedDynamicImagesForCms[number]['name']
} | {
    standardImage: StandardImage
}

/**
 * Function used to obtain image based on imageAvailablieForCms relation.
 */
export async function getImageForCmsImageRelation(
    image: ImagesAvailablieForCms,
    prisma: PrismaClient
) {
    if ('standardImage' in image) {
        return await prisma.image.findUniqueOrThrow({
            where: {
                standardImage: image.standardImage
            }
        })
    }
    return await prisma.image.findFirstOrThrow({
        where: {
            name: image.dynamicImageSeededForCmsName
        }
    })
}
