import '@pn-server-only'
import { flairAuth } from './auth'
import { flairSchema } from './schemas'
import { defineOperation } from '@/services/serviceOperation'
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
