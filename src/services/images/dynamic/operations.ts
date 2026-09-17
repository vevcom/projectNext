import '@pn-server-only'
import { dynamicImageAuth } from './auth'
import { dynamicImageSchemas } from './schemas'
import { visibilityOperations } from '@/services/visibility/operations'
import { implementDoubleLevelVisibilityOperations } from '@/services/visibility/implement'
import { defineOperation, type PrismaPossibleTransaction } from '@/services/serviceOperation'
import {
    imageOperations,
    uniqueCollectionWhere,
    expandImageCollection
} from '@/services/images/subservice/operations'
import { expandedImageCollectionIncluder } from '@/services/images/subservice/constants'
import { standardImageCollectionOperations } from '@/services/images/standard/operations'
import { cursorPageingSelection } from '@/lib/paging/cursorPageingSelection'
import type { Prisma } from '@/prisma-generated-pn-types'
import type { z } from 'zod'

async function readDefaultCollectionCover() {
    return standardImageCollectionOperations.readStandardImage({
        params: { standardImage: 'DEFAULT_IMAGE_COLLECTION_COVER' }
    })
}

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
    operation: async ({ prisma, params }) => {
        const collection = await prisma.imageCollection.findFirstOrThrow({
            where: whereConditionWithOwnershipCheck(params),
            include: expandedImageCollectionIncluder,
        })
        return expandImageCollection(collection, await readDefaultCollectionCover())
    }
})

const readCollectionPage = defineOperation({
    paramsSchema: dynamicImageSchemas.readCollectionPage,
    authorizer: async () => dynamicImageAuth.readCollectionPage.dynamicFields({}),
    operation: async ({ prisma, params }, prismaWhereFilter) => {
        const collections = await prisma.imageCollection.findMany({
            ...cursorPageingSelection(params.paging.page),
            where: {
                ...ownershipCheckWhereCondition(),
                // The filter is undefined only when the session bypasses visibility with IMAGE_ADMIN,
                // which also means it administrates every collection - hence no admin filter either.
                ...(prismaWhereFilter ? {
                    visibilityRegular: prismaWhereFilter,
                    ...(params.paging.details.showOnlyCollectionsSessionAdministrates ? {
                        visibilityAdmin: prismaWhereFilter
                    } : {})
                } : {})
            },
            include: expandedImageCollectionIncluder,
            orderBy: [
                { createdAt: 'desc' },
                { name: 'asc' }
            ],
        })

        const defaultCover = await readDefaultCollectionCover()

        return collections.map(collection => expandImageCollection(collection, defaultCover))
    }
})

export const dynamicImageOperations = {
    visibility,
    readCollection,
    readCollectionPage,

    createCollection: defineOperation({
        dataSchema: dynamicImageSchemas.createCollection,
        authorizer: () => dynamicImageAuth.createCollection.dynamicFields({}),
        opensTransaction: true,
        operation: async ({ prisma, data }) => prisma.$transaction(async tx => {
            const visibilityRegular = await visibilityOperations.create.internalCall({ prisma: tx })
            const visibilityAdmin = await visibilityOperations.createWithRequirements.internalCall({
                prisma: tx,
                data: { requirements: data.visibilityAdminRequirements },
            })

            return await tx.imageCollection.create({
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
        })
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
                        collectionId: params.collectionId
                    },
                    prisma
                }),
            }),
        ownershipCheck: ({ params, prisma }) => ownershipCheck({
            params: { collectionId: params.collectionId },
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

/**
 * Checks whether a collection belongs to the dynamic image system (i.e., is not special).
 * This is a lightweight database check without going through the full readCollection operation,
 * which would apply visibility authorization. Ownership checks should verify ownership only,
 * not authorization.
 */
async function ownershipCheck({
    params,
    prisma
}: {
    params: z.infer<typeof dynamicImageSchemas.paramsSchemaCollection>
    prisma: PrismaPossibleTransaction<false>
}): Promise<boolean> {
    const collection = await prisma.imageCollection.findUnique({
        where: uniqueCollectionWhere(params),
        select: { special: true }
    })
    return collection !== null && collection.special === null
}
