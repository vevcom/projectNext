import '@pn-server-only'
import { flairAuth } from './auth'
import { flairSchema } from './schemas'
import { defineOperation } from '@/services/serviceOperation'
import { ServerError } from '@/services/error'
import { createImageAction, readImageAction } from '@/services/images/actions'
import { unwrapActionReturn } from '@/app/redirectToErrorPage'
import { z } from 'zod'
import type { flairImageType } from '@/services/flairs/types'


export const flairOperations = {
    create: defineOperation({
        authorizer: () => flairAuth.create.dynamicFields({}),
        dataSchema: flairSchema.create,
        operation: async ({ prisma, data }) => {
            const emptyVisibility = await prisma.visibility.create({
                data: {}
            })

            const flairImageCollection = await prisma.imageCollection.upsert({
                where: {
                    special: 'FLAIRIMAGES'
                },
                create: {
                    name: 'FLAIRIMAGES',
                    visibilityAdmin: {
                        connect: emptyVisibility
                    },
                    visibilityRead: {
                        connect: emptyVisibility
                    }

                },
                update: {}
            })
            const image = unwrapActionReturn(await createImageAction(
                { params: { collectionId: flairImageCollection.id } },
                {
                    data: {
                        file: data.file,
                        alt: data.flairName,
                        name: data.flairName,
                    }
                }
            ))
            return await prisma.flair.create({
                data: {
                    image: {
                        connect: { id: image.id }
                    },
                    name: data.flairName,
                }
            })
        }
    }),
    update: defineOperation({
        authorizer: () => flairAuth.update.dynamicFields({}),
        dataSchema: flairSchema.update,
        paramsSchema: z.object({
            flairId: z.number()
        }),
        operation: async ({ prisma, params, data }) => {
            let flairImageCollection = await prisma.imageCollection.findUnique({
                where: { special: 'FLAIRIMAGES' }
            })
            if (!flairImageCollection) {
                const emptyVisibility = await prisma.visibility.create({
                    data: {}
                })

                flairImageCollection = await prisma.imageCollection.upsert({
                    where: {
                        special: 'FLAIRIMAGES'
                    },
                    create: {
                        name: 'FLAIRIMAGES',
                        visibilityAdmin: {
                            connect: emptyVisibility
                        },
                        visibilityRead: {
                            connect: emptyVisibility
                        }

                    },
                    update: {}
                })
            }
            if (data.file) {
                const image = unwrapActionReturn(await createImageAction(
                    { params: { collectionId: flairImageCollection.id } },
                    {
                        data: {
                            file: data.file,
                            alt: data.flairName,
                            name: data.flairName,
                        }
                    }
                ))
                return await prisma.flair.update({
                    where: { id: params.flairId },
                    data: {
                        image: {
                            connect: { id: image.id }
                        },
                        name: data.flairName,
                    }
                })
            }
            return await prisma.flair.update({
                where: { id: params.flairId },
                data: {
                    name: data.flairName,
                }
            })
        }
    }),
    read: defineOperation({
        authorizer: () => flairAuth.read.dynamicFields({}),
        paramsSchema: z.object({
            flairId: z.number(),
        }),
        operation: async ({ prisma, params: { flairId } }) => {
            const flair = await prisma.flair.findUnique({
                where: {
                    id: flairId,
                }
            })
            if (!flair) throw new ServerError('NOT FOUND', 'Flair not found')
            return unwrapActionReturn(await readImageAction({ params: { id: flair.imageId } }))
        }
    }),
    readAll: defineOperation({
        authorizer: () => flairAuth.read.dynamicFields({}),
        operation: async ({ prisma }) => {
            const flairs = await prisma.flair.findMany({})
            if (!flairs) throw new ServerError('NOT FOUND', 'Flair not found')
            const images: flairImageType[] = []
            for (const flair of flairs) {
                const imageData = unwrapActionReturn(await readImageAction({ params: { id: flair.imageId } }))
                const flairImage = { ...imageData, flairId: flair.id }
                images.push(flairImage)
            }
            return images
        }
    }),
    readUserFlairsId: defineOperation({
        authorizer: () => flairAuth.read.dynamicFields({}),
        paramsSchema: z.object({
            userId: z.number(),
        }),
        operation: async ({ prisma, params: { userId } }) => {
            const flairs = await prisma.user.findUnique({
                where: {
                    id: userId,
                },
                select: {
                    Flairs: true,
                }
            })
            if (!flairs) throw new ServerError('NOT FOUND', 'Flair not found')
            return flairs
        }
    }),
    readUserFlairs: defineOperation({
        authorizer: () => flairAuth.read.dynamicFields({}),
        paramsSchema: z.object({
            userId: z.number(),
        }),
        operation: async ({ prisma, params: { userId } }) => {
            const flairs = await prisma.flair.findMany({
                where: {
                    User: {
                        some: {
                            id: userId
                        }
                    }
                }
            })
            if (!flairs) throw new ServerError('NOT FOUND', 'Flair not found')
            const images: flairImageType[] = []
            for (const flair of flairs) {
                const imageData = unwrapActionReturn(await readImageAction({ params: { id: flair.imageId } }))
                const flairImage = { ...imageData, flairId: flair.id }
                images.push(flairImage)
            }
            return images
        }
    }),
    assignToUser: defineOperation({
        authorizer: () => flairAuth.assign.dynamicFields({}),
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
        authorizer: () => flairAuth.assign.dynamicFields({}),
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
        authorizer: () => flairAuth.assign.dynamicFields({}),
        paramsSchema: z.object({
            flairId: z.number(),
        }),
        operation: async ({ prisma, params: { flairId } }) => {
            const flair = await prisma.flair.delete({
                where: {
                    id: flairId,
                }
            })
            if (flair.imageId) {
                await prisma.image.delete({
                    where: {
                        id: flair.imageId,
                    }
                })
            }
        }
    })
}
