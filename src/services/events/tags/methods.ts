import '@pn-server-only'
import { EventTagAuthers } from './authers'
import { EvantTagConfig } from './config'
import { EventTagSchemas } from './schemas'
import { EventAuthers } from '@/services/events/authers'
import logger from '@/lib/logger'
import { serviceMethod } from '@/services/serviceMethod'
import { ServerError } from '@/services/error'
import { SpecialEventTags } from '@prisma/client'
import { z } from 'zod'

export namespace EventTagMethods {
    export const read = serviceMethod({
        paramsSchema: z.object({
            id: z.number(),
        }),
        authorizer: () => EventTagAuthers.read.dynamicFields({}),
        method: async ({ prisma, params: { id } }) => await prisma.eventTag.findUniqueOrThrow({
            where: {
                id
            }
        })
    })
    export const readSpecial = serviceMethod({
        paramsSchema: z.object({
            special: z.nativeEnum(SpecialEventTags),
        }),
        authorizer: () => EventTagAuthers.readSpecial.dynamicFields({}),
        method: async ({ prisma, params: { special } }) => {
            const tag = await prisma.eventTag.findUnique({
                where: {
                    special
                }
            })
            if (!tag) {
                logger.error(`Special event tag ${special} not found - creating it`)
                return await prisma.eventTag.create({
                    data: {
                        special,
                        ...EvantTagConfig.specials[special]
                    }
                })
            }
            return tag
        }
    })
    export const readAll = serviceMethod({
        authorizer: () => EventTagAuthers.readAll.dynamicFields({}),
        method: async ({ prisma }) => await prisma.eventTag.findMany()
    })
    export const create = serviceMethod({
        dataSchema: EventTagSchemas.create,
        authorizer: () => EventTagAuthers.create.dynamicFields({}),
        method: async ({ prisma, data: { color, ...data } }) => {
            const colorR = parseInt(color.slice(1, 3), 16)
            const colorG = parseInt(color.slice(3, 5), 16)
            const colorB = parseInt(color.slice(5, 7), 16)
            return await prisma.eventTag.create({
                data: {
                    ...data,
                    colorR,
                    colorG,
                    colorB,
                }
            })
        }
    })
    export const update = serviceMethod({
        paramsSchema: z.object({
            id: z.number(),
        }),
        dataSchema: EventTagSchemas.update,
        authorizer: () => EventAuthers.update.dynamicFields({}),
        method: async ({ prisma, params: { id }, data: { color, ...data } }) => {
            const colorR = color ? parseInt(color.slice(1, 3), 16) : undefined
            const colorG = color ? parseInt(color.slice(3, 5), 16) : undefined
            const colorB = color ? parseInt(color.slice(5, 7), 16) : undefined
            return await prisma.eventTag.update({
                where: {
                    id
                },
                data: {
                    ...data,
                    colorR,
                    colorG,
                    colorB,
                }
            })
        }
    })
    export const destroy = serviceMethod({
        paramsSchema: z.object({
            id: z.number(),
        }),
        authorizer: () => EventAuthers.destroy.dynamicFields({}),
        method: async ({ prisma, params }) => {
            const tag = await prisma.eventTag.findUniqueOrThrow({
                where: { id: params.id }
            })
            if (tag.special) {
                throw new ServerError('BAD PARAMETERS', 'Kan ikke slette spesialtagger')
            }
            await prisma.eventTag.delete({
                where: { id: params.id }
            })
        }
    })
}
