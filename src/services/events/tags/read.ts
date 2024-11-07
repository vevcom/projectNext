import 'server-only'
import { SpecialEventTagsConfig } from './ConfigVars'
import { ServiceMethodHandler } from '@/services/ServiceMethodHandler'
import logger from '@/logger'
import type { SpecialEventTags } from '@prisma/client'

export const read = ServiceMethodHandler({
    withData: false,
    handler: async (prisma, { id }: { id: number }) => await prisma.eventTag.findUniqueOrThrow({
        where: {
            id
        }
    })
})

export const readSpecial = ServiceMethodHandler({
    withData: false,
    handler: async (prisma, { special }: { special: SpecialEventTags }) => {
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

export const readAll = ServiceMethodHandler({
    withData: false,
    handler: async (prisma) => await prisma.eventTag.findMany()
})
