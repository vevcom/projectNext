import '@pn-server-only'
import { dynamicImageAuth } from './auth'
import { dynamicImageSchemas } from './schemas'
import { visibilityOperations } from '@/services/visibility/operations'
import { implementDoubleLevelVisibilityOperations } from '@/services/visibility/implement'
import { defineOperation, type PrismaPossibleTransaction } from '@/services/serviceOperation'
import { imageOperations, uniqueCollectionWhere } from '@/services/images/subservice/operations'
import { readPageInputSchemaObject } from '@/lib/paging/schema'
import { standardImageCollectionOperations } from '@/services/images/standard/operations'
import { cursorPageingSelection } from '@/lib/paging/cursorPageingSelection'
import { z } from 'zod'
import type { Image, Prisma } from '@/prisma-generated-pn-types'

const visibility = implementDoubleLevelVisibilityOperations({
    implementationParamsSchema: dynamicImageSchemas.paramsSchemaCollection,
    authorizers: {
        readDoubleLevelMatrix: ({ doubleLevelMatrix }) => dynamicImageAuth.readDoubleLevelMatrix.dynamicFields({
            doubleLevelMatrix,
        }),
        updateRegularLevel: ({ doubleLevelMatrix }) => dynamicImageAuth.updateRegularLevel.dynamicFields({
            doubleLevelMatrix,
        }),
        updateAdminLevel: ({ doubleLevelMatrix }) => dynamicImageAuth.updateAdminLevel.dynamicFields({
            doubleLevelMatrix,
        })
    },
    readDoubleLevel: async ({ prisma, implementationParams, include }) => {
        const collection = await prisma.imageCollection.findFirstOrThrow({
            where: whereConditionWithOwnershipCheck(implementationParams),
            include: {
                visibilityRegular: {
                    include
                },
                visibilityAdmin: {
                    include
                }
            }
        })
        return {
            regularLevel: collection.visibilityRegular,
            adminLevel: collection.visibilityAdmin
        }
    }
})

const readCollection = defineOperation({
    paramsSchema: dynamicImageSchemas.paramsSchemaCollection,
    authorizer: async ({ params, prisma }) =>
        dynamicImageAuth.readCollection.dynamicFields({
            doubleLevelMatrix: await visibility.readDoubleLevelMatrixInternal({
                params,
                prisma
            })
        }),
    operation: async ({ prisma, params }) =>
        await prisma.imageCollection.findFirstOrThrow({
            where: whereConditionWithOwnershipCheck(params),
        })
})

const readCollectionPage = defineOperation({
    paramsSchema: readPageInputSchemaObject(
        z.number(),
        z.object({
            id: z.number()
        }),
        z.object({
            name: z.string()
        })
    ),
    authorizer: async () => dynamicImageAuth.readCollectionPage.dynamicFields({}),
    operation: async ({ prisma, params }, prismaWhereFilter) => {
        const collections = await prisma.imageCollection.findMany({
            ...cursorPageingSelection(params.paging.page),
            where: {
                ...prismaWhereFilter,
                ...ownershipCheckWhereCondition()
            },
            include: {
                coverImage: true,
                images: {
                    take: 1
                },
                _count: {
                    select: {
                        images: true
                    }
                }
            },
            orderBy: [
                { createdAt: 'desc' },
                { name: 'asc' }
            ],
        })

        const lensCamera = standardImageCollectionOperations.readStandardImage({
            params: {
                standardImage: 'DEFAULT_IMAGE_COLLECTION_COVER'
            }
        })

        const chooseCoverImage = (collection: {
            coverImage: Image | null,
            images: Image[]
        }) => {
            if (collection.coverImage) return collection.coverImage
            if (collection.images[0]) return collection.images[0]
            if (lensCamera) return lensCamera
            return null
        }

        return collections.map(collection => ({
            ...collection,
            coverImage: chooseCoverImage(collection),
            numberOfImages: collection._count.images,
        }))
    }
})

export const dynamicImageOperations = {
    visibility,
    readCollection,
    readCollectionPage,

    createCollection: defineOperation({
        dataSchema: dynamicImageSchemas.createCollection,
        authorizer: () => dynamicImageAuth.createCollection.dynamicFields({}),
        operation: async ({ prisma, data }) => {
            const visibilityRegular = await visibilityOperations.create.internalCall({})
            const visibilityAdmin = await visibilityOperations.create.internalCall({})

            return await prisma.imageCollection.create({
                data: {
                    name: data.collectionName,
                    description: data.collectionDescription,
                    visibilityRegular: {
                        connect: {
                            id: visibilityRegular.id
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

    destroyCollection: imageOperations.destroyCollection.implement({
        authorizer: async ({ params, prisma }) =>
            dynamicImageAuth.destroyCollection.dynamicFields({
                doubleLevelMatrix: await visibility.readDoubleLevelMatrixInternal({
                    params,
                    prisma
                })
            }),
        ownershipCheck,
    }),

    updateCollection: imageOperations.updateCollection.implement({
        authorizer: async ({ params, prisma }) =>
            dynamicImageAuth.updateCollection.dynamicFields({
                doubleLevelMatrix: await visibility.readDoubleLevelMatrixInternal({
                    params,
                    prisma
                }),
            }),
        ownershipCheck,
    }),

    uploadImage: imageOperations.uploadImage.implement({
        authorizer: async ({ params, prisma }) =>
            dynamicImageAuth.uploadImage.dynamicFields({
                doubleLevelMatrix: await visibility.readDoubleLevelMatrixInternal({
                    params,
                    prisma
                }),
            }),
        ownershipCheck,
        operationImplementationFields: { uploadAsStandardImage: null }
    }),

    uploadManyImages: imageOperations.uploadManyImages.implement({
        authorizer: async ({ params, prisma }) =>
            dynamicImageAuth.uploadManyImages.dynamicFields({
                doubleLevelMatrix: await visibility.readDoubleLevelMatrixInternal({
                    params,
                    prisma
                }),
            }),
        ownershipCheck,
    }),

    readPageOfImagesInCollection: imageOperations.readPageOfImagesInCollection.implement({
        authorizer: async ({ params, prisma }) =>
            dynamicImageAuth.readPageOfImagesInCollection.dynamicFields({
                doubleLevelMatrix: await visibility.readDoubleLevelMatrixInternal({
                    params: {
                        collectionId: params.paging.details.collectionId
                    },
                    prisma
                }),
            }),
        ownershipCheck: ({ params, prisma }) => ownershipCheck({
            params: { collectionId: params.paging.details.collectionId },
            prisma
        }),
    }),

    updateImageMeta: imageOperations.updateImageMeta.implement({
        authorizer: async ({ params, prisma }) =>
            dynamicImageAuth.updateImageMeta.dynamicFields({
                doubleLevelMatrix: await visibility.readDoubleLevelMatrixInternal({
                    params: {
                        collectionId: (await imageOperations.readCollectionOfImage.internalCall({ params })).id,
                    },
                    prisma
                }),
            }),
        ownershipCheck: async ({ params, prisma }) => ownershipCheck({
            params: { collectionId: (await imageOperations.readCollectionOfImage.internalCall({ params })).id },
            prisma
        }),
    }),

    destroyImage: imageOperations.destroyImage.implement({
        authorizer: async ({ params, prisma }) =>
            dynamicImageAuth.destroyImage.dynamicFields({
                doubleLevelMatrix: await visibility.readDoubleLevelMatrixInternal({
                    params: {
                        collectionId: (await imageOperations.readCollectionOfImage.internalCall({ params })).id,
                    },
                    prisma
                }),
            }),
        ownershipCheck: async ({ params, prisma }) => ownershipCheck({
            params: { collectionId: (await imageOperations.readCollectionOfImage.internalCall({ params })).id },
            prisma
        }),
    }),
} as const

function whereConditionWithOwnershipCheck(params: z.infer<typeof dynamicImageSchemas.paramsSchemaCollection>) {
    return {
        ...uniqueCollectionWhere(params),
        ...ownershipCheckWhereCondition()
    } satisfies Prisma.ImageCollectionWhereInput
}

/**
 * This where clause makes sure that the collections read through the dynamic image system are not special.
 * The special collections are not 'owned' by the dynamic system and should be read through the 'special' system.
 *
 * The 'update type' and 'destroy type' suboperations being implemented by this service make this check through the
 * standard `ownershipCheck`
 * atribute.
 */
function ownershipCheckWhereCondition() {
    return {
        special: null
    } satisfies Prisma.ImageCollectionWhereInput
}

async function ownershipCheck({
    params,
    prisma
}: {
    params: z.infer<typeof dynamicImageSchemas.paramsSchemaCollection>
    prisma: PrismaPossibleTransaction<false>
}): Promise<boolean> {
    return (await readCollection({ params, prisma })).special === null
}
