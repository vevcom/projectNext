import '@pn-server-only'
import { imageSchemas } from './schemas'
import { visibilityOperations } from '@/services/visibility/operations'
import { defineSubOperation } from '@/services/serviceOperation'
import { z } from 'zod'

export const imageOperations = {
    createCollection: defineSubOperation({
        dataSchema: () => imageSchemas.createCollection,
        operation: () => async ({ prisma, data }) => {
            //Note: that not all implementations of image service actually uses visibility,
            //but for the schema it is required. If it is used is up to the service implementing image-system
            const visibilityRead = await visibilityOperations.create({ bypassAuth: true })
            const visibilityAdmin = await visibilityOperations.create({ bypassAuth: true })

            return prisma.imageCollection.create({
                data: {
                    ...data,
                    visibilityRead: {
                        connect: {
                            id: visibilityRead.id
                        }
                    },
                    visibilityAdmin: {
                        connect: {
                            id: visibilityAdmin.id
                        }
                    }
                }
            })
        }
    }),
    destroyCollection: defineSubOperation({
        paramsSchema: () => z.object({
            collectionId: z.number(),
        }),
        operation: () => async ({ prisma, params }) => {
            const collection = await prisma.imageCollection.delete({
                where: {
                    id: params.collectionId,
                },
            })

            await visibilityOperations.destroy({ params: { visibilityId: collection.visibilityAdminId }, bypassAuth: true })
            await visibilityOperations.destroy({ params: { visibilityId: collection.visibilityReadId }, bypassAuth: true })
            return collection
        }
    }),
    updateCollection: defineSubOperation({
        paramsSchema: () => z.object({
            collectionId: z.number(),
        }),
        dataSchema: () => imageSchemas.updateCollection,
        operation: () => async ({ prisma, params, data: { coverImageId, ...data } }) =>
            await prisma.imageCollection.update({
                where: {
                    id: params.collectionId
                },
                data: {
                    ...data,
                    coverImage: {
                        connect: coverImageId ? {
                            id: coverImageId
                        } : undefined
                    }
                }
            })
    }),
    readCollection: defineSubOperation({

    }),

    
    uploadOneImage: defineSubOperation({

    }),
    uploadManyImages: defineSubOperation({

    }),
    readImagePage: defineSubOperation({

    }),
} as const
