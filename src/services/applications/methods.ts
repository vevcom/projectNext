import '@pn-server-only'
import { ApplicationAuthers } from './authers'
import { ApplicationSchemas } from './schemas'
import { ServerError } from '@/services/error'
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

    export const create = ServiceMethod({
        dataSchema: ApplicationSchemas.create,
        paramsSchema: z.object({
            userId: z.number(),
            commiteeParticipationId: z.number()
        }),
        auther: ({ params }) => ApplicationAuthers.create.dynamicFields({ userId: params.userId }),
        method: async ({ prisma, data, params }) => {
            const commiteeParticipation = await prisma.committeeParticipationInApplicationPeriod.findUniqueOrThrow({
                where: {
                    id: params.commiteeParticipationId
                },
            })

            const usersLowestPriorityApplicationInPeriod = await prisma.application.findFirst({
                where: {
                    userId: params.userId,
                    applicationPeriodId: commiteeParticipation.applicationPeriodId
                },
                orderBy: {
                    priority: 'desc'
                },
                select: {
                    priority: true
                }
            }).then(application => application?.priority ?? 0)

            console.log({ text: data.text,
                userId: params.userId,
                applicationPeriodCommiteeId: params.commiteeParticipationId,
                applicationPeriodId: commiteeParticipation.applicationPeriodId,
                priority: usersLowestPriorityApplicationInPeriod + 1, })

            await prisma.application.create({
                data: {
                    text: data.text,
                    userId: params.userId,
                    applicationPeriodCommiteeId: params.commiteeParticipationId,
                    applicationPeriodId: commiteeParticipation.applicationPeriodId,
                    priority: usersLowestPriorityApplicationInPeriod + 1,
                }
            })
        },
    })

    export const update = ServiceMethod({
        dataSchema: ApplicationSchemas.update,
        paramsSchema: z.object({
            userId: z.number(),
            commiteeParticipationId: z.number()
        }),
        opensTransaction: true,
        auther: ({ params }) => ApplicationAuthers.update.dynamicFields({ userId: params.userId }),
        method: async ({ prisma, data, params }) => {
            const application = await prisma.application.findUniqueOrThrow({
                where: {
                    userId_applicationPeriodCommiteeId: {
                        userId: params.userId,
                        applicationPeriodCommiteeId: params.commiteeParticipationId
                    }
                }
            })


            if (data.text !== undefined) {
                await prisma.application.update({
                    where: {
                        userId_applicationPeriodCommiteeId: {
                            userId: params.userId,
                            applicationPeriodCommiteeId: params.commiteeParticipationId
                        }
                    },
                    data: {
                        text: data.text
                    }
                })
            }
            if (data.priority === undefined) return
            const otherApplication = await prisma.application.findFirst({
                where: {
                    userId: params.userId,
                    applicationPeriodId: application.applicationPeriodId,
                    priority: data.priority === 'UP' ? application.priority - 1 : application.priority + 1
                }
            })

            if (!otherApplication) {
                throw new ServerError(
                    'BAD PARAMETERS', 'The application is already at the top or bottom of the priority list.'
                )
            }
            // Swap the priorities if the other application exists.
            // Must temporarly change the priority to -1 to avoid unique constraint violation
            prisma.$transaction(async (tx) => {
                await tx.application.update({
                    where: {
                        userId_applicationPeriodCommiteeId: {
                            userId: params.userId,
                            applicationPeriodCommiteeId: params.commiteeParticipationId
                        }
                    },
                    data: {
                        priority: -1 // Temporarily set to -1 to avoid unique constraint violation
                    }
                })

                await tx.application.update({
                    where: {
                        id: otherApplication.id
                    },
                    data: {
                        priority: application.priority
                    }
                })

                await tx.application.update({
                    where: {
                        userId_applicationPeriodCommiteeId: {
                            userId: params.userId,
                            applicationPeriodCommiteeId: params.commiteeParticipationId
                        }
                    },
                    data: {
                        priority: data.priority === 'UP' ? application.priority - 1 : application.priority + 1
                    }
                })
            })
        },
    })
}
