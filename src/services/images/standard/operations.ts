import '@pn-server-only'
import { standardImageAuth } from './auth'
import { implementSpecialCollection } from '@/services/images/subservice/special/implementSpecialCollection'
import { defineOperation, defineSubOperation } from '@/services/serviceOperation'
import logger from '@/lib/logger'
import { StandardImage } from '@/prisma-generated-pn-types'
import { z } from 'zod'
import { imageOperations } from '../subservice/operations'
import { StandardImageConfig } from './constants'

const { specialCollectionPanelOperations: standardCollectionPanelOperations } = implementSpecialCollection({
    special: 'STANDARDIMAGES',
    readSpecialCollectionPanelAuther: standardImageAuth.readSpecialCollectionPanel.dynamicFields({}),
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

/**
 * The standard images are housed in the standardcollection - a special image collection.
 * It exposes the panel operations for reading the images in the collection
 * but also the method for reading a standard image. If it is not found in the database,
 * it will be created from the static config on runtime.
 */
export const standardImageCollectionOperations = {
    readStandardImage: defineOperation({
        authorizer: () => standardImageAuth.readStandardImage.dynamicFields({}),
        paramsSchema: z.object({
            standardImage: z.nativeEnum(StandardImage)
        }),
        operation: async ({ prisma, params }) => {
            const image = await prisma.image.findUnique({
                where: {
                    standardImage: params.standardImage
                }
            })

            const standardCollection =
                await standardCollectionPanelOperations.readCollection({})
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

            return {}
        }
    }),
    generateStandardImageFromConfig: defineSubOperation({
        paramsSchema: () => z.object({
            standardImage: z.nativeEnum(StandardImage)
        }),
        operation: () => async ({ prisma, params }) => {
            const config = StandardImageConfig[params.standardImage]
            await prisma.image.delete({
                where: {
                    standardImage: params.standardImage
                }
            })

            return await imageOperations.uploadImage.internalCall({
                prisma,
                data: {
                    imageFile,
                    imageAlt: config.alt,
                    imageName: config.name,
                    imageLicenseId: ...,
                    imageCredit: config.credit,
                },
                operationImplementationFields: { uploadAsStandardImage: params.standardImage }
            })
        }
    }),
    panelOperations: standardCollectionPanelOperations,
} as const
