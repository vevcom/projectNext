import '@pn-server-only'
import { ApplicationPeriodAuthers } from './authers'
import { ApplicationPeriodSchemas } from './schemas'
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

    export const create = ServiceMethod({
        auther: () => ApplicationPeriodAuthers.create.dynamicFields({}),
        dataSchema: ApplicationPeriodSchemas.create,
        method: async ({ prisma, data }) => {
            console.log('creating application period', data)
            await prisma.applicationPeriod.create({
                data: {
                    name: data.name,
                    startDate: data.startDate,
                    endDate: data.endDate,
                    committeesParticipating: {
                        create: data.participatingCommitteeIds.map(id => ({ committeeId: id }))
                    }
                }
            })
        }
    })
}
