import { standardImageCollectionOperations } from '@/services/images/standard/operations'
import { StandardImage } from '@/prisma-generated-pn/enums'
import { dynamicImageOperations } from '@/services/images/dynamic/operations'
import { standardStoreFiles } from '@/lib/standardStore/files'
import type { PrismaClient } from '@/prisma-generated-pn-client'
import type { StandardStoreFile } from '@/lib/standardStore/files'
import { getUploadImageData } from '@/lib/standardStore/getUploadImageData'

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

export async function seedImages(prisma: PrismaClient) {
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
        const license = await 

        await dynamicImageOperations.uploadImage({
            prisma,
            data: getUploadImageData,
            params: {
                collectionId: collectionForImagesUsedForSeededCms.id,
            }
        })
    }))
}

export type ImagesAvailablieForCms = {
    name: typeof seedDynamicImagesForCms[number]['name']
} | {
    standardImage: StandardImage
}
