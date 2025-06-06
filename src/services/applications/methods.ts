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
                select: {
                    applicationPeriod: {
                        select: {
                            id: true,
                            startDate: true,
                            endDate: true,
                        }
                    }
                }
            })

            if (Date.now() < commiteeParticipation.applicationPeriod.startDate.getTime()) {
                throw new ServerError(
                    'BAD PARAMETERS', 'The application period has not started yet.'
                )
            } else if (Date.now() > commiteeParticipation.applicationPeriod.endDate.getTime()) {
                throw new ServerError(
                    'BAD PARAMETERS', 'The application period has ended.'
                )
            }

            const usersLowestPriorityApplicationInPeriod = await prisma.application.findFirst({
                where: {
                    userId: params.userId,
                    applicationPeriodId: commiteeParticipation.applicationPeriod.id
                },
                orderBy: {
                    priority: 'desc'
                },
                select: {
                    priority: true
                }
            }).then(application => application?.priority ?? 0)

            await prisma.application.create({
                data: {
                    text: data.text,
                    userId: params.userId,
                    applicationPeriodCommiteeId: params.commiteeParticipationId,
                    applicationPeriodId: commiteeParticipation.applicationPeriod.id,
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
                    },
                },
                select: {
                    priority: true,
                    applicationPeriodId: true,
                    applicationPeriodCommitee: {
                        select: {
                            applicationPeriod: {
                                select: {
                                    endDate: true,
                                    startDate: true,
                                    endPriorityDate: true
                                }
                            }
                        }
                    }
                }
            })
            const { startDate, endDate, endPriorityDate } = application.applicationPeriodCommitee.applicationPeriod
            if (Date.now() < startDate.getTime()) {
                throw new ServerError(
                    'BAD PARAMETERS', 'The application period has not started yet.'
                )
            }

            if (data.text !== undefined) {
                if (Date.now() > endDate.getTime()) {
                    throw new ServerError(
                        'BAD PARAMETERS', 'The application period has ended.'
                    )
                }
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
            if (Date.now() > endPriorityDate.getTime()) {
                throw new ServerError(
                    'BAD PARAMETERS', 'The priority period has ended.'
                )
            }

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

    export const destroy = ServiceMethod({
        paramsSchema: z.object({
            userId: z.number(),
            commiteeParticipationId: z.number()
        }),
        auther: ({ params }) => ApplicationAuthers.destroy.dynamicFields({ userId: params.userId }),
        opensTransaction: true,
        method: async ({ prisma, params }) => {
            prisma.$transaction(async (tx) => {
                const application = await tx.application.delete({
                    where: {
                        userId_applicationPeriodCommiteeId: {
                            userId: params.userId,
                            applicationPeriodCommiteeId: params.commiteeParticipationId
                        }
                    },
                    select: {
                        priority: true,
                        applicationPeriodId: true,
                        applicationPeriodCommitee: {
                            select: {
                                applicationPeriod: {
                                    select: {
                                        endDate: true,
                                    }
                                }
                            }
                        }
                    }
                })
                if (Date.now() > application.applicationPeriodCommitee.applicationPeriod.endDate.getTime()) {
                    throw new ServerError(
                        'BAD PARAMETERS', 'The application period has ended.'
                    )
                }
                await tx.application.updateMany({
                    where: {
                        userId: params.userId,
                        applicationPeriodId: application.applicationPeriodId,
                        priority: {
                            gt: application.priority
                        }
                    },
                    data: {
                        priority: {
                            decrement: 1
                        }
                    }
                })
            })
        }
    })
}
