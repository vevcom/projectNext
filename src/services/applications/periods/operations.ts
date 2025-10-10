import '@pn-server-only'
import { applicationPeriodAuthers } from './authers'
import { applicationPeriodSchemas } from './schemas'
import { committeesParticipatingincluder } from './config'
import { applicationOperations } from '@/services/applications/operations'
import { ServerError } from '@/services/error'
import { defineOperation } from '@/services/serviceOperation'
import { z } from 'zod'

export const applicationPeriodOperations = {
    readAll: defineOperation({
        authorizer: () => applicationPeriodAuthers.readAll.dynamicFields({}),
        operation: async ({ prisma }) => prisma.applicationPeriod.findMany()
    }),

    read: defineOperation({
        authorizer: () => applicationPeriodAuthers.read.dynamicFields({}),
        paramsSchema: z.object({
            name: z.string()
        }),
        operation: async ({ prisma, params }) => prisma.applicationPeriod.findUniqueOrThrow({
            where: { name: params.name },
            include: committeesParticipatingincluder,
        })
    }),

    create: defineOperation({
        authorizer: () => applicationPeriodAuthers.create.dynamicFields({}),
        dataSchema: applicationPeriodSchemas.create,
        operation: async ({ prisma, data }) => {
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
            return { name: data.name }
        }
    }),

    update: defineOperation({
        authorizer: () => applicationPeriodAuthers.update.dynamicFields({}),
        dataSchema: applicationPeriodSchemas.update,
        paramsSchema: z.object({
            name: z.string()
        }),
        operation: async ({ prisma, data, params }) => {
            const period = await prisma.applicationPeriod.update({
                where: { name: params.name },
                data: {
                    name: data.name,
                    startDate: data.startDate,
                    endDate: data.endDate,
                    endPriorityDate: data.endPriorityDate,
                },
                include: {
                    committeesParticipating: {
                        select: {
                            committeeId: true
                        },
                    },
                },
            })

            if (data.participatingCommitteeIds) {
                // Remove applications to committees that are no longer participating
                // This must be done through the applicationOperations.destroy method to ensure
                // that reordering priorities is handled correctly.
                await Promise.all(
                    period.committeesParticipating
                        .map(committee => committee.committeeId)
                        .filter(id => !(data.participatingCommitteeIds ?? []).includes(id))
                        .map(async id => {
                            const removeApplications = await prisma.application.findMany({
                                where: {
                                    applicationPeriodId: period.id,
                                    applicationPeriodCommitee: {
                                        committeeId: id
                                    }
                                },
                                select: {
                                    userId: true,
                                    applicationPeriodCommiteeId: true
                                }
                            })
                            await Promise.all(
                                removeApplications.map(async application =>
                                    await applicationOperations.destroy({
                                        params: {
                                            userId: application.userId,
                                            commiteeParticipationId: application.applicationPeriodCommiteeId
                                        },
                                    })
                                )
                            )
                        })
                )

                await prisma.committeeParticipationInApplicationPeriod.createMany({
                    data: data.participatingCommitteeIds.map(id => ({
                        applicationPeriodId: period.id,
                        committeeId: id
                    })),
                    skipDuplicates: true
                })
                await prisma.committeeParticipationInApplicationPeriod.deleteMany({
                    where: {
                        applicationPeriodId: period.id,
                        committeeId: {
                            notIn: data.participatingCommitteeIds
                        }
                    }
                })
            }

            return { name: period.name }
        }
    }),

    removeAllApplicationTexts: defineOperation({
        paramsSchema: z.object({
            name: z.string()
        }),
        authorizer: () => applicationPeriodAuthers.removeAllApplicationTexts.dynamicFields({}),
        operation: async ({ prisma, params, session }) => {
            const period = await applicationPeriodOperations.read({
                params: { name: params.name },
                session
            })
            if (period.endPriorityDate.getTime() > Date.now()) {
                throw new ServerError(
                    'DISSALLOWED', 'You cannot remove application texts before the end of the priority date.'
                )
            }
            await prisma.application.updateMany({
                where: {
                    applicationPeriodId: period.id
                },
                data: {
                    text: 'SLETTET TEKST',
                }
            })
        }
    }),

    destroy: defineOperation({
        authorizer: () => applicationPeriodAuthers.destroy.dynamicFields({}),
        paramsSchema: z.object({
            name: z.string()
        }),
        operation: async ({ prisma, params }) => {
            await prisma.applicationPeriod.delete({
                where: { name: params.name }
            })
        }
    }),

    readNumberOfApplications: defineOperation({
        authorizer: () => applicationPeriodAuthers.readNumberOfApplications.dynamicFields({}),
        paramsSchema: z.object({
            name: z.string()
        }),
        operation: async ({ prisma, params }) => {
            const period = await prisma.applicationPeriod.findUniqueOrThrow({
                where: { name: params.name },
                select: {
                    id: true
                },
            })
            return await prisma.application.count({
                where: {
                    applicationPeriodId: period.id
                },
            })
        }
    }),
}
