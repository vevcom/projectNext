import 'server-only'
import { ServiceMethod } from '@/services/ServiceMethod'
import { deleteReleasePeriodAuther } from '@/services/cabin/authers'
import { z } from 'zod'


export const deleteReleasePeriod = ServiceMethod({
    auther: () => deleteReleasePeriodAuther.dynamicFields({}),
    paramsSchema: z.object({
        id: z.number(),
    }),
    method: async ({ prisma, params }) => prisma.releasePeriod.delete({
        where: {
            id: params.id,
        }
    })
})
