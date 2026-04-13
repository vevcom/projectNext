import '@pn-server-only'
import { defineOperation, defineSubOperation } from '@/services/serviceOperation'
import { imageOperations } from '@/services/images/subservice/operations'
import { imageSchemas } from '@/services/images/subservice/schemas'
import logger from '@/lib/logger'
import { visibilityOperations } from '@/services/visibility/operations'
import type { SpecialCollection } from '@/prisma-generated-pn-types'
import type { AuthorizerDynamicFieldsBound } from '@/auth/authorizer/Authorizer'

export function implementSpecialCollection({
    special,
    readSpecialCollectionPanelAuther,
    config
}: {
    special: SpecialCollection,
    readSpecialCollectionPanelAuther: AuthorizerDynamicFieldsBound
    config: {
        name: string,
        description: string,
    }
}) {
    const readCollection = defineOperation({
        authorizer: () => readSpecialCollectionPanelAuther,
        operation: async ({ prisma }) => {
            const collection = await prisma.imageCollection.findUnique({
                where: {
                    special,
                },
            })
            if (collection) return collection

            logger.error(`
                Special collection with special ${special} not found
                It must therefore be created from the config.
            `)

            //Note: visibilities are not actually used for special collections, but required by the schema.
            const visibilityRegular = await visibilityOperations.create.internalCall({})
            const visibilityAdmin = await visibilityOperations.create.internalCall({})

            return await prisma.imageCollection.create({
                data: {
                    name: config.name,
                    description: config.description,
                    special,
                    visibilityAdmin: {
                        connect: {
                            id: visibilityAdmin.id,
                        }
                    },
                    visibilityRegular: {
                        connect: {
                            id: visibilityRegular.id,
                        }
                    }
                }
            })
        }
    })

    return {
        internalOperations: {
            uploadImage: defineSubOperation({
                dataSchema: () => imageSchemas.uploadImage,
                operation: () => async ({ data }) =>
                    imageOperations.uploadImage.internalCall({
                        params: {
                            collectionId: (await readCollection({})).id,
                        },
                        data,
                        operationImplementationFields: { uploadAsStandardImage: null }
                    })
            }),
            destroyImage: imageOperations.destroyImage,
        },
        specialCollectionPanelOperations: {
            readCollection,
            readPageOfImagesInCollection: imageOperations.readPageOfImagesInCollection.implement({
                authorizer: () => readSpecialCollectionPanelAuther,
                ownershipCheck: async ({ params }) => await readCollection({}).then(
                    collection => collection?.id === params.paging.details.collectionId
                )
            }),
        }
    } as const
}
