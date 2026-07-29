import '@pn-server-only'
import { StandardImageConfig } from './constants'
import { standardImageCollectionAuth, standardImagesImagePanelAuth } from './auth'
import { implementSpecialCollection } from '@/services/images/subservice/special/implement'
import { defineOperation, defineSubOperation } from '@/services/serviceOperation'
import logger from '@/lib/logger'
import { StandardImage } from '@/prisma-generated-pn-types'
import { imageOperations } from '@/services/images/subservice/operations'
import { allowedExtensions, expandedImageIncluder } from '@/services/images/subservice/constants'
import { z } from 'zod'
import type { ExpandedImage } from '@/services/images/subservice/types'

const {
    specialCollectionPanelOperations: standardImagesImagePanelOperations,
    generateCollectionFromConfig: generateStandardImagesCollectionFromConfig
} = implementSpecialCollection({
    special: 'STANDARDIMAGES',
    imagePanelAuther: standardImagesImagePanelAuth.dynamicFields({}),
    allowedExtensions,
    config: {
        name: 'Standardbilder',
        description: `
            Bilder som er nødvendige for nettsiden.
            Denne koleksjonen er helt \'statisk\' og skal og kan ikke modifiseres.
            Dersom et standardbilde (et bilde i denne kolleksjonen) mangler vil bildet genereres ut fra
            sin statisk bestemte konfigurasjon.
        `,
    }
})

const generateStandardImageFromConfig = defineSubOperation({
    paramsSchema: () => z.object({
        standardImage: z.nativeEnum(StandardImage)
    }),
    operation: () => async ({ prisma, params }) => {
        const config = StandardImageConfig[params.standardImage]
        const existingImage = await prisma.image.findUnique({
            where: {
                standardImage: params.standardImage
            }
        })
        if (existingImage) {
            await prisma.image.delete({
                where: {
                    standardImage: params.standardImage
                }
            })
        }

        return await imageOperations.uploadImage.internalCall({
            prisma,
            data: await config.standardStoreFile.imageUploadData({
                name: config.name,
                alt: config.alt
            }),
            params: {
                collectionId: (await standardImagesImagePanelOperations.readCollection({})).id,
            },
            operationImplementationFields: {
                uploadAsStandardImage: params.standardImage,
                allowedExtensions,
            }
        })
    }
})

const readStandardImage = defineOperation({
    authorizer: () => standardImageCollectionAuth.readStandardImage.dynamicFields({}),
    paramsSchema: z.object({
        standardImage: z.nativeEnum(StandardImage)
    }),
    operation: async ({ prisma, params }) => {
        const image = await prisma.image.findUnique({
            where: {
                standardImage: params.standardImage
            },
            include: expandedImageIncluder,
        })

        const standardCollection =
            await standardImagesImagePanelOperations.readCollection({})
        const standardImageIsPartOfStandardCollection = standardCollection.id === image?.collectionId

        if (image && standardImageIsPartOfStandardCollection) return image

        if (image) {
            logger.error(`
                Standard image ${params.standardImage} found in database, but not part of the standard collection.
                This should never happen, as the standard collection should be the only collection 
                that can have standard images.
                Generating it again from the config to ensure data integrity.
            `)
        } else {
            logger.error(`
                Standard image ${params.standardImage} not found in database.
                This should never happen, as it should be seeded on every environment.
                Creating it on runtime from the config.     
            `)
        }

        return await generateStandardImageFromConfig.internalCall({
            prisma,
            params: { standardImage: params.standardImage }
        })
    }
})

const readAllStandardImages = defineOperation({
    authorizer: () => standardImageCollectionAuth.readStandardImage.dynamicFields({}),
    operation: async (): Promise<Record<StandardImage, ExpandedImage>> => {
        const entries = await Promise.all(
            Object.values(StandardImage).map(async standardImage =>
                [standardImage, await readStandardImage({ params: { standardImage } })] as const
            )
        )
        return Object.fromEntries(entries) as Record<StandardImage, ExpandedImage>
    }
})

export { standardImagesImagePanelOperations, generateStandardImagesCollectionFromConfig }

/**
 * The standard images are housed in the standardcollection - a special image collection.
 * It exposes the method for reading a single standard image, or all of them at once.
 *
 * If the image does not exist in the database, it will be generated from its config,
 * using the generateStandardImageFromConfig operation.
 */
export const standardImageCollectionOperations = {
    readStandardImage,
    readAllStandardImages,
    generateStandardImageFromConfig,
} as const
