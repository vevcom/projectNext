import '@pn-server-only'
import { cmsImageSchemas } from './schemas'
import { ServerOnly } from '@/auth/auther/ServerOnly'
import { defineOperation, defineSubOperation } from '@/services/serviceOperation'
import { ServerError } from '@/services/error'
import { z } from 'zod'
import { SpecialCmsImage } from '@prisma/client'

const create = defineOperation({
    authorizer: ServerOnly,
    dataSchema: cmsImageSchemas.create,
    operation: ({ prisma, data: { imageId, ...data } }) => prisma.cmsImage.create({
        data: {
            ...data,
            image: imageId !== undefined ? {
                connect: {
                    id: imageId
                }
            } : undefined
        },
        include: {
            image: true
        }
    })
})

export const cmsImageOperations = {
    create,

    readSpecial: defineSubOperation({
        paramsSchema: () => z.object({
            special: z.nativeEnum(SpecialCmsImage)
        }),
        operation: () => async ({ prisma, params }) => {
            const image = await prisma.cmsImage.findUnique({
                where: {
                    special: params.special
                },
                include: {
                    image: true
                }
            })
            if (!image) {
                return create({
                    data: {
                        name: params.special,
                        special: params.special
                    }
                })
            }
            return image
        }
    }),

    update: defineSubOperation({
        paramsSchema: () => z.object({
            id: z.number()
        }),
        dataSchema: () => cmsImageSchemas.update,
        operation: () => ({ prisma, params, data: { imageId, ...data } }) => prisma.cmsImage.update({
            where: {
                id: params.id,
            },
            data: {
                ...data,
                image: imageId !== undefined ? {
                    connect: {
                        id: imageId
                    }
                } : undefined
            },
            include: {
                image: true
            }
        })
    }),

    destroy: defineOperation({
        authorizer: ServerOnly,
        paramsSchema: z.object({
            id: z.number()
        }),
        operation: async ({ prisma, params }) => {
            const cmsImage = await prisma.cmsImage.findUniqueOrThrow({
                where: {
                    id: params.id
                }
            })
            if (cmsImage.special) throw new ServerError('BAD PARAMETERS', 'Cannot delete special CMS image')
            await prisma.cmsImage.delete({
                where: {
                    id: params.id
                }
            })
        }
    }),

    /**
     * Check if a cms image with id is special with special atribute
     * in the provided special array
     * This is useful to do ownership checks for services using special cms images.
     */
    isSpecial: defineOperation({
        authorizer: ServerOnly,
        paramsSchema: z.object({
            id: z.number(),
            special: z.array(z.nativeEnum(SpecialCmsImage))
        }),
        operation: async ({ prisma, params }) => {
            const image = await prisma.cmsImage.findUnique({
                where: {
                    id: params.id,
                },
                select: {
                    special: true,
                }
            })
            if (!image) throw new ServerError('NOT FOUND', 'Cms image not found')
            if (!image?.special) return false
            return params.special.includes(image.special)
        }
    })
} as const
