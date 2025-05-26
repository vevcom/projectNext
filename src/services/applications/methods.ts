import '@pn-server-only'
import { ApplicationAuthers } from './authers'
import { ServiceMethod } from '@/services/ServiceMethod'
import { z } from 'zod'

export namespace ApplicationMethods {
    export const readForUser = ServiceMethod({
        paramsSchema: z.object({
            userId: z.number(),
            periodId: z.number()
        }),
        auther: ({ params }) => ApplicationAuthers.readForUser.dynamicFields({ userId: params.userId }),
        method: async ({ prisma, params }) => prisma.application.findMany({
            where: {
                userId: params.userId,
                applicationPeriodId: params.periodId
            }
        })
    })
}
