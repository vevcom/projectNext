import '@pn-server-only'
import { eventTagAuth } from './auth'
import { specialEventTags } from './constants'
import { eventTagSchemas } from './schemas'
import { eventAuth } from '@/services/events/auth'
import logger from '@/lib/logger'
import { defineOperation } from '@/services/serviceOperation'
import { ServerError } from '@/services/error'
import { SpecialEventTags } from '@prisma/client'
import { z } from 'zod'

export const eventTagOperations = {
    read: defineOperation({
        paramsSchema: z.object({
            id: z.number(),
        }),
        authorizer: () => eventTagAuth.read.dynamicFields({}),
        operation: async ({ prisma, params: { id } }) => await prisma.eventTag.findUniqueOrThrow({
            where: {
                id
            }
        })
    }),
    readSpecial: defineOperation({
        paramsSchema: z.object({
            special: z.nativeEnum(SpecialEventTags),
        }),
        authorizer: () => eventTagAuth.readSpecial.dynamicFields({}),
        operation: async ({ prisma, params: { special } }) => {
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
                        ...specialEventTags[special]
                    }
                })
            }
            return tag
        }
    }),
    readAll: defineOperation({
        authorizer: () => eventTagAuth.readAll.dynamicFields({}),
        operation: async ({ prisma }) => await prisma.eventTag.findMany()
    }),
    create: defineOperation({
        dataSchema: eventTagSchemas.create,
        authorizer: () => eventTagAuth.create.dynamicFields({}),
        operation: async ({ prisma, data: { color, ...data } }) => {
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
    }),
    update: defineOperation({
        paramsSchema: z.object({
            id: z.number(),
        }),
        dataSchema: eventTagSchemas.update,
        authorizer: () => eventAuth.update.dynamicFields({}),
        operation: async ({ prisma, params: { id }, data: { color, ...data } }) => {
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
    }),
    destroy: defineOperation({
        paramsSchema: z.object({
            id: z.number(),
        }),
        authorizer: () => eventAuth.destroy.dynamicFields({}),
        operation: async ({ prisma, params }) => {
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
    }),
}
