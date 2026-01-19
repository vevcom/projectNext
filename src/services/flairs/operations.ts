import '@pn-server-only'
import { flairAuth } from './auth'
import { flairSchema } from './schemas'
import { defineOperation } from '@/services/serviceOperation'
import { ServerError } from '@/services/error'
import { cmsImageOperations } from '@/cms/images/operations'
import { z } from 'zod'

const read = defineOperation({
    authorizer: () => flairAuth.read.dynamicFields({}),
    paramsSchema: z.object({
        flairId: z.number(),
    }),
    operation: async ({ prisma, params: { flairId } }) =>
        await prisma.flair.findUniqueOrThrow({
            where: {
                id: flairId,
            },
            include: {
                cmsImage: {
                    include: {
                        image: true
                    }
                }
            }
        })
})

export const flairOperations = {
    create: defineOperation({
        authorizer: () => flairAuth.create.dynamicFields({}),
        dataSchema: flairSchema.create,
        operation: async ({ prisma, data }) =>
            await prisma.flair.create({
                data: {
                    cmsImage: {
                        create: {

                        }
                    },
                    name: data.name,
                    colorR: data.color.red,
                    colorG: data.color.green,
                    colorB: data.color.blue,
                }
            })
    }),
    update: defineOperation({
        authorizer: () => flairAuth.update.dynamicFields({}),
        dataSchema: flairSchema.update,
        paramsSchema: z.object({
            flairId: z.number()
        }),
        operation: async ({ prisma, params, data }) =>
            prisma.flair.update({
                where: {
                    id: params.flairId,
                },
                data: {
                    name: data.name,
                    colorR: data.color?.red,
                    colorG: data.color?.green,
                    colorB: data.color?.blue,
                }
            })
    }),
    read,
    readAll: defineOperation({
        authorizer: () => flairAuth.readAll.dynamicFields({}),
        operation: async ({ prisma }) => {
            const flairs = await prisma.flair.findMany({
                include: {
                    cmsImage: {
                        include: {
                            image: true
                        }
                    }
                }
            })
            return flairs
        }
    }),
    readUserFlairs: defineOperation({
        authorizer: ({ params }) => flairAuth.readUserFlairs.dynamicFields({ userId: params.userId }),
        paramsSchema: z.object({
            userId: z.number(),
        }),
        operation: async ({ prisma, params: { userId } }) =>
            await prisma.user.findUniqueOrThrow({
                where: {
                    id: userId,
                },
                select: {
                    Flairs: {
                        include: {
                            cmsImage: {
                                include: {
                                    image: true
                                }
                            }
                        }
                    },
                }
            }).then(user => user.Flairs)
    }),
    assignToUser: defineOperation({
        authorizer: () => flairAuth.assignToUser.dynamicFields({}),
        paramsSchema: z.object({
            flairId: z.number(),
            userId: z.number(),
        }),
        operation: async ({ prisma, params }) => {
            const flair = await prisma.flair.findUnique({
                where: { id: params.flairId }
            })
            if (!flair) {
                throw new Error(`Flair with id ${params.flairId} not found`)
            }


            return await prisma.flair.update({
                where: {
                    id: params.flairId,
                },
                data: {
                    User: {
                        connect: {
                            id: params.userId
                        }
                    }
                }
            })
        }
        ,
    }),
    unAssignToUser: defineOperation({
        authorizer: () => flairAuth.unAssignToUser.dynamicFields({}),
        paramsSchema: z.object({
            flairId: z.number(),
            userId: z.number(),
        }),
        operation: async ({ prisma, params }) =>
            await prisma.flair.update({
                where: {
                    id: params.flairId,
                },
                data: {
                    User: {
                        disconnect: {
                            id: params.userId
                        }
                    }
                }
            })
        ,
    }),
    destroy: defineOperation({
        authorizer: () => flairAuth.destroy.dynamicFields({}),
        paramsSchema: z.object({
            flairId: z.number(),
        }),
        opensTransaction: true,
        operation: async ({ prisma, params: { flairId } }) => {
            prisma.$transaction(async tx => {
                const flair = await tx.flair.delete({
                    where: {
                        id: flairId,
                    }
                })
                await cmsImageOperations.destroy({
                    bypassAuth: true,
                    prisma: tx,
                    params: {
                        cmsImageId: flair.imageId,
                    }
                })
            })
        }
    }),
    increaseRank: defineOperation({
        authorizer: () => flairAuth.increaseRank.dynamicFields({}),
        paramsSchema: z.object({
            flairId: z.number(),
        }),
        operation: async ({ prisma, params: { flairId } }) => {
            const flair = await prisma.flair.findUniqueOrThrow({
                where: { id: flairId }
            })
            const lowerFlair = await prisma.flair.findFirst({
                where: {
                    rank: {
                        lt: flair.rank
                    }
                },
                orderBy: {
                    rank: 'desc'
                }
            })
            if (!lowerFlair) {
                throw new ServerError('BAD PARAMETERS', 'Flair is already at lowest rank')
            }
            const tempRank = -99999999
            await prisma.flair.update({
                where: { id: lowerFlair.id },
                data: { rank: tempRank }
            })
            await prisma.flair.update({
                where: { id: flair.id },
                data: { rank: lowerFlair.rank }
            })
            await prisma.flair.update({
                where: { id: lowerFlair.id },
                data: { rank: flair.rank }
            })
        }
    }),
    decreaseRank: defineOperation({
        authorizer: () => flairAuth.decreaseRank.dynamicFields({}),
        paramsSchema: z.object({
            flairId: z.number(),
        }),
        operation: async ({ prisma, params: { flairId } }) => {
            const flair = await prisma.flair.findUniqueOrThrow({
                where: { id: flairId }
            })
            const higherFlair = await prisma.flair.findFirst({
                where: {
                    rank: {
                        gt: flair.rank
                    }
                },
                orderBy: {
                    rank: 'asc'
                }
            })
            if (!higherFlair) {
                throw new ServerError('BAD PARAMETERS', 'Flair is already at highest rank')
            }
            // Use a temporary rank to avoid unique constraint violation
            const tempRank = -99999999
            await prisma.flair.update({
                where: { id: higherFlair.id },
                data: { rank: tempRank }
            })
            await prisma.flair.update({
                where: { id: flair.id },
                data: { rank: higherFlair.rank }
            })
            await prisma.flair.update({
                where: { id: higherFlair.id },
                data: { rank: flair.rank }
            })
        }
    }),
    updateCmsImage: cmsImageOperations.update.implement({
        authorizer: () => flairAuth.updateCmsImage.dynamicFields({}),
        implementationParamsSchema: z.object({
            flairId: z.number(),
        }),
        ownershipCheck: async ({ params, implementationParams }) => {
            const flair = await read({ params: { flairId: implementationParams.flairId } })
            return flair.cmsImage.id === params.cmsImageId
        }
    })
}
