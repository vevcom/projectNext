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
        method: async ({ prisma, params }) => prisma.applicationPeriod.findUniqueOrThrow({
            where: { name: params.name },
            include: {
                committeesParticipating: {
                    include: {
                        committee: {
                            include: {
                                logoImage: {
                                    include: {
                                        image: true
                                    }
                                },
                                paragraph: true
                            }
                        }
                    }
                }
            }
        })
    })

    export const create = ServiceMethod({
        auther: () => ApplicationPeriodAuthers.create.dynamicFields({}),
        dataSchema: ApplicationPeriodSchemas.create,
        method: async ({ prisma, data }) => {
            await prisma.applicationPeriod.create({
                data: {
                    name: data.name,
                    startDate: data.startDate,
                    endDate: data.endDate,
                    endPriorityDate: data.endPriorityDate,
                    committeesParticipating: {
                        create: data.participatingCommitteeIds.map(id => ({ committeeId: id }))
                    }
                }
            })
        }
    })

    export const update = ServiceMethod({
        auther: () => ApplicationPeriodAuthers.update.dynamicFields({}),
        dataSchema: ApplicationPeriodSchemas.update,
        paramsSchema: z.object({
            name: z.string()
        }),
        method: async ({ prisma, data, params }) => {
            const period = await prisma.applicationPeriod.update({
                where: { name: params.name },
                data: {
                    name: data.name,
                    startDate: data.startDate,
                    endDate: data.endDate,
                    endPriorityDate: data.endPriorityDate,
                }
            })

            if (data.participatingCommitteeIds) {
                await prisma.committeeParticipationInApplicationPeriod.deleteMany({
                    where: {
                        applicationPeriodId: period.id,
                        committeeId: {
                            notIn: data.participatingCommitteeIds
                        }
                    }
                })

                await prisma.committeeParticipationInApplicationPeriod.createMany({
                    data: data.participatingCommitteeIds.map(id => ({
                        applicationPeriodId: period.id,
                        committeeId: id
                    })),
                    skipDuplicates: true
                })
            }
        }
    })
}
