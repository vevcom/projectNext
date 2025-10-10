import '@pn-server-only'
import { applicationPeriodAuthers } from './authers'
import { applicationPeriodSchemas } from './schemas'
import { committeesParticipatingincluder } from './config'
import { applicationMethods } from '@/services/applications/methods'
import { ServerError } from '@/services/error'
import { serviceMethod } from '@/services/serviceMethod'
import { z } from 'zod'

export const applicationPeriodMethods = {
    readAll: serviceMethod({
        authorizer: () => applicationPeriodAuthers.readAll.dynamicFields({}),
        method: async ({ prisma }) => prisma.applicationPeriod.findMany()
    }),

    read: serviceMethod({
        authorizer: () => applicationPeriodAuthers.read.dynamicFields({}),
        paramsSchema: z.object({
            name: z.string()
        }),
        method: async ({ prisma, params }) => prisma.applicationPeriod.findUniqueOrThrow({
            where: { name: params.name },
            include: committeesParticipatingincluder,
        })
    }),

    create: serviceMethod({
        authorizer: () => applicationPeriodAuthers.create.dynamicFields({}),
        dataSchema: applicationPeriodSchemas.create,
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
            return { name: data.name }
        }
    }),

    update: serviceMethod({
        authorizer: () => applicationPeriodAuthers.update.dynamicFields({}),
        dataSchema: applicationPeriodSchemas.update,
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
                // This must be done through the applicationMethods.destroy method to ensure
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
                                    await applicationMethods.destroy({
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

    removeAllApplicationTexts: serviceMethod({
        paramsSchema: z.object({
            name: z.string()
        }),
        authorizer: () => applicationPeriodAuthers.removeAllApplicationTexts.dynamicFields({}),
        method: async ({ prisma, params, session }) => {
            const period = await applicationPeriodMethods.read({
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

    destroy: serviceMethod({
        authorizer: () => applicationPeriodAuthers.destroy.dynamicFields({}),
        paramsSchema: z.object({
            name: z.string()
        }),
        method: async ({ prisma, params }) => {
            await prisma.applicationPeriod.delete({
                where: { name: params.name }
            })
        }
    }),

    readNumberOfApplications: serviceMethod({
        authorizer: () => applicationPeriodAuthers.readNumberOfApplications.dynamicFields({}),
        paramsSchema: z.object({
            name: z.string()
        }),
        method: async ({ prisma, params }) => {
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
