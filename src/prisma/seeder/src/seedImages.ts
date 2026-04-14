import { standardImageCollectionOperations } from '@/services/images/standard/operations'
import { StandardImage } from '@/prisma-generated-pn/enums'
import { dynamicImageOperations } from '@/services/images/dynamic/operations'
import { standardStoreFiles } from '@/lib/standardStore/files'
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
    {
        standardStoreFile: standardStoreFiles.pwa,
        name: 'pwa',
        alt: 'PWA',
    },
] as const satisfies {
    standardStoreFile: StandardStoreFile,
    name: string,
    alt: string,
}[]

/**
 * This function seeds
 *
 * 1. standard images, using the standardImageCollection api. - note that this is actually not striclty necessary,
 * as the standard images are generated on the fly when requested, if one uses the
 * standardImageCollection api to request them.
 *
 * 2. A set of dynamic images, which are seeded into a dynamic collection. These are used for dunamic cms constent which is
 * seeded later on.
 */
export default async function seedImages(prisma: PrismaClient) {
    await Promise.all(
        Object.values(StandardImage).map(async (standardImage) => {
            standardImageCollectionOperations.generateStandardImageFromConfig.internalCall({
                prisma,
                params: { standardImage }
            })
        })
    )

    const collectionForImagesUsedForSeededCms = await dynamicImageOperations.createCollection({
        prisma,
        data: {
            collectionName: 'seeded cms images',
            collectionDescription: 'A collection for images used for seeded cms content',
        }
    })

    await Promise.all(seedDynamicImagesForCms.map(async (imageConfig) => {
        await dynamicImageOperations.uploadImage({
            prisma,
            data: await imageConfig.standardStoreFile.imageUploadData({
                name: imageConfig.name,
                alt: imageConfig.alt
            }),
            params: {
                collectionId: collectionForImagesUsedForSeededCms.id,
            }
        })
    }))
}

export type ImagesAvailablieForCms = {
    dynamicImageSeededForCmsName: typeof seedDynamicImagesForCms[number]['name']
} | {
    standardImage: StandardImage
}
