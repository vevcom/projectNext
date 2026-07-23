import '@pn-server-only'
import { cmsImageSchemas } from './schemas'
import { defineSubOperation } from '@/services/serviceOperation'
import { sessionAdministratesCollectionOfImage } from '@/services/images/subservice/administration'
import { ServerError, Smorekopp } from '@/services/error'
import { z } from 'zod'
import { SpecialCmsImage } from '@/prisma-generated-pn-types'
import logger from '@/lib/logger'

const create = defineSubOperation({
    dataSchema: () => cmsImageSchemas.create,
    operation: () => ({ prisma, data: { imageId, ...data } }) => prisma.cmsImage.create({
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
                logger.error(`Could not find special cms image with special ${params.special} - creating it!`)
                return create.internalCall({
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
            cmsImageId: z.number()
        }),
        dataSchema: () => cmsImageSchemas.update,
        operation: () => async ({ prisma, params, session, bypassAuth, data: { imageId, ...data } }) => {
            // The implementing service authorizes editing the cms image itself, but not the image
            // being linked into it - a session may only point a cms image at an image from a
            // collection it administrates.
            if (imageId !== undefined && !bypassAuth) {
                const administrates = await sessionAdministratesCollectionOfImage({
                    prisma,
                    session,
                    imageId,
                })
                if (!administrates) {
                    throw new Smorekopp(
                        'UNAUTHORIZED',
                        'Du kan bare bruke bilder fra samlinger du administrerer'
                    )
                }
            }

            return prisma.cmsImage.update({
                where: {
                    id: params.cmsImageId,
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
        }
    }),

    destroy: defineSubOperation({
        paramsSchema: () => z.object({
            cmsImageId: z.number()
        }),
        operation: () => async ({ prisma, params }) => {
            const cmsImage = await prisma.cmsImage.findUniqueOrThrow({
                where: {
                    id: params.cmsImageId
                }
            })
            if (cmsImage.special) throw new ServerError('BAD PARAMETERS', 'Cannot delete special CMS image')
            await prisma.cmsImage.delete({
                where: {
                    id: params.cmsImageId
                }
            })
        }
    }),

    /**
     * Check if a cms image with id is special with special atribute
     * in the provided special array
     * This is useful to do ownership checks for services using special cms images.
     */
    isSpecial: defineSubOperation({
        paramsSchema: () => z.object({
            cmsImageId: z.number(),
            special: z.array(z.nativeEnum(SpecialCmsImage))
        }),
        operation: () => async ({ prisma, params }) => {
            const image = await prisma.cmsImage.findUnique({
                where: {
                    id: params.cmsImageId,
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
