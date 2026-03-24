import { standardImageAuth } from './auth'
import { implementSpecialCollection } from '@/services/images/subservice/special/implementSpecialCollection'
import { defineOperation } from '@/services/serviceOperation'
import logger from '@/lib/logger'
import { SpecialImage } from '@/prisma-generated-pn-types'
import { z } from 'zod'

const standardImageCollectionOperations = implementSpecialCollection({
    special: 'STANDARDIMAGES',
    readSpecialCollectionPanelAuther: standardImageAuth.readSpecialCollectionPanel.dynamicFields({}),
    config: {
        name: 'Standardbilder',
        description: `
            Bilder som er nødvendige for nettsiden.
            Denne koleksjonen er helt \'statisk\' og skal og kan ikke modifiseres.
            Dersom et standardbilde (et bilde i denne kolleksjonen) mangler vil bildet genereres ut fra konfigurasjon.
        `,
    }
})

export const standardImageCollection = {
    readStandardImage: defineOperation({
        authorizer: () => standardImageAuth.readStandardImage.dynamicFields({}),
        paramsSchema: z.object({
            specialImage: z.nativeEnum(SpecialImage)
        }),
        operation: async ({ prisma, params }) => {
            const image = await prisma.image.findUnique({
                where: {
                    special: params.specialImage
                }
            })

            if (image) return image

            logger.error(`
                Special image ${params.specialImage} not found in database.
                This should never happen, as it should be seeded on every environment.
                Creating it on runtime from the config.
            `)

            return standardImageCollectionOperations.internalOperations.uploadImage.internalCall({
                prisma,
                data: {

                }
            })
        }
    }),
    panelOperations: standardImageCollectionOperations.specialCollectionPanelOperations,
} as const
