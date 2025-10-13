import 'server-only'
import { cabinReleasePeriodAuth } from './auth'
import { cabinReleasePeriodSchemas } from './schemas'
import { defineOperation } from '@/services/serviceOperation'
import { ServerError } from '@/services/error'
import { z } from 'zod'

export const cabinReleasePeriodOperations = {

    create: defineOperation({
        authorizer: () => cabinReleasePeriodAuth.createReleasePeriodAuther.dynamicFields({}),
        dataSchema: cabinReleasePeriodSchemas.createReleasePeriod,
        operation: async ({ prisma, data }) => {
            const latestReleasePeriod = await prisma.releasePeriod.findFirst({
                orderBy: {
                    releaseTime: 'desc',
                },
            })

            if (latestReleasePeriod && latestReleasePeriod.releaseTime > data.releaseTime) {
                throw new ServerError('BAD DATA', 'En ny slippdato må slippes senere den den gjeldene siste slippdatoen.')
            }

            if (latestReleasePeriod && latestReleasePeriod.releaseUntil >= data.releaseUntil) {
                throw new ServerError('BAD DATA', 'Et nytt slipp, må slippe flere datoer enn det forrige slippet.')
            }

            await prisma.releasePeriod.create({
                data,
            })
        }
    }),

    destroy: defineOperation({
        authorizer: () => cabinReleasePeriodAuth.deleteReleasePeriodAuther.dynamicFields({}),
        paramsSchema: z.object({
            id: z.number(),
        }),
        operation: async ({ prisma, params }) => {
            const releasePeriod = await prisma.releasePeriod.findUniqueOrThrow({
                where: params,
            })

            if (releasePeriod.releaseTime < new Date()) {
                throw new ServerError('BAD PARAMETERS', 'Kan ikke slette en slippgruppe som har blitt publisert.')
            }

            return await prisma.releasePeriod.delete({
                where: params,
            })
        }
    }),

    readMany: defineOperation({
        authorizer: () => cabinReleasePeriodAuth.readReleasePeriodAuther.dynamicFields({}),
        operation: async ({ prisma }) => prisma.releasePeriod.findMany({
            orderBy: {
                releaseUntil: 'desc',
            }
        })
    }),

    getCurrentReleasePeriod: defineOperation({
        authorizer: () => cabinReleasePeriodAuth.readReleasePeriodAuther.dynamicFields({}),
        operation: async ({ prisma }) => prisma.releasePeriod.findFirst({
            where: {
                releaseTime: {
                    lte: new Date(),
                }
            },
            orderBy: {
                releaseUntil: 'desc',
            },
            take: 1
        })
    }),

    update: defineOperation({
        authorizer: () => cabinReleasePeriodAuth.updateReleasePeriodAuther.dynamicFields({}),
        dataSchema: cabinReleasePeriodSchemas.updateReleasePeriod,
        operation: async ({ prisma, data }) => prisma.releasePeriod.update({
            where: {
                id: data.id, // TODO: Figure out why id is in data and not a param
            },
            data: {
                releaseUntil: data.releaseUntil,
                releaseTime: data.releaseTime,
            },
        })
    }),
}
