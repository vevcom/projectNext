import 'server-only'
import { destroyEventAuther } from './authers'
import { ServiceMethod } from '@/services/ServiceMethod'
import { z } from 'zod'

export const destroyEvent = ServiceMethod({
    paramsSchema: z.object({
        id: z.number()
    }),
    auther: () => destroyEventAuther.dynamicFields({}),
    method: async ({ prisma, params }) => {
        await prisma.event.delete({
            where: {
                id: params.id
            }
        })
    }
})
