import '@pn-server-only'
import { committeeParticipationAuth } from './auth'
import { defineOperation } from '@/services/serviceOperation'
import { z } from 'zod'

export const committeeParticipationOperations = {
    read: defineOperation({
        paramsSchema: z.object({
            participationId: z.number(),
        }),
        authorizer: async ({ prisma, params }) => committeeParticipationAuth.read.dynamicFields({
            groupId: await prisma.committeeParticipationInApplicationPeriod.findUniqueOrThrow({
                where: {
                    id: params.participationId
                },
                select: {
                    committee: {
                        select: {
                            group: {
                                select: {
                                    id: true,
                                }
                            }
                        }
                    }
                }
            }).then((participation) => participation.committee.group.id)
        }),
        operation: async ({ prisma, params }) => (
            await prisma.committeeParticipationInApplicationPeriod.findUniqueOrThrow({
                where: {
                    id: params.participationId
                },
                select: {
                    applications: {
                        select: {
                            priority: true,
                            text: true,
                            user: {
                                select: {
                                    firstname: true,
                                    lastname: true,
                                    image: true,
                                    email: true,
                                    username: true,
                                }
                            }
                        }
                    }
                }
            }).then((applications) => applications.applications.map((application) => (
                {
                    applicationText: application.text,
                    applicationPriority: application.priority,
                    firstname: application.user.firstname,
                    lastname: application.user.lastname,
                    image: application.user.image,
                    email: application.user.email,
                    username: application.user.username,
                }
            )))
        )
    }),
    readAll: defineOperation({
        paramsSchema: z.object({
            committeeId: z.number(),
        }),
        authorizer: async ({ prisma, params }) => committeeParticipationAuth.read.dynamicFields({
            groupId: await prisma.committee.findUniqueOrThrow({
                where: {
                    id: params.committeeId
                },
                select: {
                    groupId: true
                }
            }).then((committee) => committee.groupId)
        }),
        operation: async ({ prisma, params }) => (
            await prisma.committeeParticipationInApplicationPeriod.findMany({
                where: {
                    committeeId: params.committeeId
                },
                select: {
                    _count: {
                        select: {
                            applications: true,
                        }
                    },
                    id: true,
                    applicationPeriod: {
                        select: {
                            startDate: true,
                            endPriorityDate: true,
                            endDate: true,
                        }
                    }
                }
            }).then((periods) => periods.map((period) => (
                {
                    participationId: period.id,
                    applicationCount: period._count.applications,
                    startDate: period.applicationPeriod.startDate,
                    endDate: period.applicationPeriod.endDate,
                    endPriorityDate: period.applicationPeriod.endPriorityDate,
                })
            )
            )
        )
    })
}
