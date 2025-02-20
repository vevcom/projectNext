import 'server-only'
import { SpecialEventTagsConfig } from './ConfigVars'
import { readAllEventTagsAuther, readEventTagAuther, readSpecialEventTagAuther } from './authers'
import logger from '@/lib/logger'
import { ServiceMethod } from '@/services/ServiceMethod'
import { SpecialEventTags } from '@prisma/client'
import { z } from 'zod'

export const readEventTag = ServiceMethod({
    paramsSchema: z.object({
        id: z.number(),
    }),
    auther: () => readEventTagAuther.dynamicFields({}),
    method: async ({ prisma, params: { id } }) => await prisma.eventTag.findUniqueOrThrow({
        where: {
            id
        }
    })
})

export const readSpecialEventTag = ServiceMethod({
    paramsSchema: z.object({
        special: z.nativeEnum(SpecialEventTags),
    }),
    auther: () => readSpecialEventTagAuther.dynamicFields({}),
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
                    ...SpecialEventTagsConfig[special]
                }
            })
        }
        return tag
    }
})

export const readAllEventTags = ServiceMethod({
    auther: () => readAllEventTagsAuther.dynamicFields({}),
    method: async ({ prisma }) => await prisma.eventTag.findMany()
})
