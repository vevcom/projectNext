import 'server-only'
import { ServiceMethodHandler } from '@/services/ServiceMethodHandler'
import { SpecialEventTags } from '@prisma/client'
import logger from '@/logger'
import EventTagsAdmin from '@/app/_components/Event/EventTagsAdmin'
import { EventTags } from '.'
import { SpecialEventTagsConfig } from './ConfigVars'

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
    }
})

export const readAll = ServiceMethodHandler({
    withData: false,
    handler: async (prisma) => await prisma.eventTag.findMany()
})
