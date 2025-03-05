import { CabinReleasePeriodAuthers } from './authers'
import { ServiceMethod } from '@/services/ServiceMethod'
import 'server-only'
import { z } from 'zod'
import { CabinReleasePeriodSchemas } from './schemas'

export namespace CabinReleasePeriodMethods {

    export const create = ServiceMethod({
        auther: () => CabinReleasePeriodAuthers.createReleasePeriodAuther.dynamicFields({}),
        dataSchema: CabinReleasePeriodSchemas.createReleasePeriod,
        method: async ({ prisma, data }) => prisma.releasePeriod.create({
            data,
        })
    })

    export const destroy = ServiceMethod({
        auther: () => CabinReleasePeriodAuthers.deleteReleasePeriodAuther.dynamicFields({}),
        paramsSchema: z.object({
            id: z.number(),
        }),
        method: async ({ prisma, params }) => prisma.releasePeriod.delete({
            where: params,
        })
    })

    export const readMany = ServiceMethod({
        auther: () => CabinReleasePeriodAuthers.readReleasePeriodAuther.dynamicFields({}),
        method: async ({ prisma }) => prisma.releasePeriod.findMany({
            orderBy: {
                releaseUntil: 'desc',
            }
        })
    })

    export const update = ServiceMethod({
        auther: () => CabinReleasePeriodAuthers.updateReleasePeriodAuther.dynamicFields({}),
        dataSchema: CabinReleasePeriodSchemas.updateReleasePeriod,
        method: async ({ prisma, data }) => prisma.releasePeriod.update({
            where: {
                id: data.id, // TODO: Figure out why id is in data and not a param
            },
            data: {
                releaseUntil: data.releaseUntil,
                releaseTime: data.releaseTime,
            },
        })
    })
}
