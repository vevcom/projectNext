import 'server-only'
import { destroyEventTagAuther } from './authers'
import { ServerError } from '@/services/error'
import { ServiceMethod } from '@/services/ServiceMethod'
import { z } from 'zod'

export const destroyEventTag = ServiceMethod({
    paramsSchema: z.object({
        id: z.number(),
    }),
    auther: () => destroyEventTagAuther.dynamicFields({}),
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
