import '@pn-server-only'
import { defineOperation, defineSubOperation } from '@/services/serviceOperation'
import { imageOperations, expandImageCollection } from '@/services/images/subservice/operations'
import { expandedImageCollectionIncluder, type ImageExtension } from '@/services/images/subservice/constants'
import { imageSchemas } from '@/services/images/subservice/schemas'
import { ServerError } from '@/services/error'
import logger from '@/lib/logger'
import { visibilityOperations } from '@/services/visibility/operations'
import type { SpecialCollection } from '@/prisma-generated-pn-types'
import type { AuthorizerDynamicFieldsBound } from '@/auth/authorizer/Authorizer'

export function implementSpecialCollection({
    special,
    imagePanelAuther,
    allowedExtensions,
    config
}: {
    special: SpecialCollection,
    imagePanelAuther: AuthorizerDynamicFieldsBound
    /**
     * Which of the image system's extensions this collection accepts on upload.
     * Some special collection may only for example expect svg files, while others may only expect raster images. The store implementation
     */
    allowedExtensions: readonly ImageExtension[],
    config: {
        name: string,
        description: string,
    }
}) {
    const generateCollectionFromConfig = defineSubOperation({
        operation: () => async ({ prisma }) => {
            //Note: visibilities are not actually used for special collections, but required by the schema.
            const visibilityRegular = await visibilityOperations.create.internalCall({})
            const visibilityAdmin = await visibilityOperations.create.internalCall({})

            const data = {
                name: config.name,
                description: config.description,
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

            const created = await prisma.imageCollection.upsert({
                where: { special },
                update: data,
                create: { ...data, special },
                include: expandedImageCollectionIncluder,
            })
            return expandImageCollection(created, null)
        }
    })

    const readCollection = defineOperation({
        authorizer: () => imagePanelAuther,
        operation: async ({ prisma }) => {
            const collection = await prisma.imageCollection.findUnique({
                where: {
                    special,
                },
                include: expandedImageCollectionIncluder,
            })
            // Note: we do not pass the a standard image in here as calling
            // on the standard images service might cause an infinite loop,
            // as the standard collection is read to validate that the standard
            // image is in a correct state.
            if (collection) return expandImageCollection(collection, null)

            logger.error(`
                Special collection with special ${special} not found
                It must therefore be created from the config.
            `)

            return generateCollectionFromConfig.internalCall({ prisma })
        }
    })

    const uploadImage = defineSubOperation({
        dataSchema: () => imageSchemas.uploadImage,
        operation: () => async ({ data }) =>
            imageOperations.uploadImage.internalCall({
                params: {
                    collectionId: (await readCollection({})).id,
                },
                data,
                operationImplementationFields: { uploadAsStandardImage: null, allowedExtensions }
            })
    })

    // Here one could just forward imageOperation.destroyImage, as the internalOperations,
    // are not to be exposed to the client, and we may trust that the implementer service code
    // does not call this operation with imageIds it does not own interanally.
    // However, for sanity, and to catch any potential bugs, the subservice will
    // enforce ownership of imageId.
    const destroyImage = defineSubOperation({
        paramsSchema: () => imageSchemas.paramsSchemaImage,
        operation: () => async ({ prisma, params }) => {
            const collection = await readCollection({})
            const image = await prisma.image.findFirst({
                where: {
                    id: params.imageId,
                    collectionId: collection.id,
                },
                select: { id: true }
            })
            if (!image) {
                throw new ServerError(
                    'BAD PARAMETERS',
                    `Image ${params.imageId} is not part of the special collection ${special}`
                )
            }
            return imageOperations.destroyImage.internalCall({ params })
        }
    })

    const readPageOfImagesInCollection = defineOperation({
        authorizer: () => imagePanelAuther,
        paramsSchema: imageSchemas.paramsSchemaReadPageOfImagesInSpecialCollection,
        operation: async ({ params }) => {
            const collection = await readCollection({})
            return imageOperations.readPageOfImagesInCollection.internalCall({
                params: {
                    paging: params.paging,
                    collectionId: collection.id,
                },
            })
        }
    })

    return {
        internalOperations: {
            uploadImage,
            destroyImage,
        },
        specialCollectionPanelOperations: {
            readCollection,
            readPageOfImagesInCollection,
        },
        generateCollectionFromConfig,
    } as const
}
