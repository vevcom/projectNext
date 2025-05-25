import '@pn-server-only'
import { ApplicationPeriodAuthers } from './authers'
import { ServiceMethod } from '@/services/ServiceMethod'
import { z } from 'zod'

export namespace ApplicationPeriodMethods {
    export const readAll = ServiceMethod({
        auther: () => ApplicationPeriodAuthers.readAll.dynamicFields({}),
        method: async ({ prisma }) => prisma.applicationPeriod.findMany()
    })

    export const read = ServiceMethod({
        auther: () => ApplicationPeriodAuthers.read.dynamicFields({}),
        paramsSchema: z.object({
            name: z.string()
        }),
        method: async ({ prisma, params }) => prisma.applicationPeriod.findUniqueOrThrow({ where: { name: params.name } })
    })
}
