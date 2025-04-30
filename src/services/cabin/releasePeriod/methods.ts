import { CabinReleasePeriodAuthers } from './authers'
import { CabinReleasePeriodSchemas } from './schemas'
import { ServiceMethod } from '@/services/ServiceMethod'
import 'server-only'
import { ServerError } from '@/services/error'
import { z } from 'zod'

export namespace CabinReleasePeriodMethods {

    export const create = ServiceMethod({
        auther: () => CabinReleasePeriodAuthers.createReleasePeriodAuther.dynamicFields({}),
        dataSchema: CabinReleasePeriodSchemas.createReleasePeriod,
        method: async ({ prisma, data }) => {
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
    })

    export const destroy = ServiceMethod({
        auther: () => CabinReleasePeriodAuthers.deleteReleasePeriodAuther.dynamicFields({}),
        paramsSchema: z.object({
            id: z.number(),
        }),
        method: async ({ prisma, params }) => {
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
    })

    export const readMany = ServiceMethod({
        auther: () => CabinReleasePeriodAuthers.readReleasePeriodAuther.dynamicFields({}),
        method: async ({ prisma }) => prisma.releasePeriod.findMany({
            orderBy: {
                releaseUntil: 'desc',
            }
        })
    })

    export const getCurrentReleasePeriod = ServiceMethod({
        auther: () => CabinReleasePeriodAuthers.readReleasePeriodAuther.dynamicFields({}),
        method: async ({ prisma }) => prisma.releasePeriod.findFirst({
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
