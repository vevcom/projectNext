import { CabinPricePeriodAuthers } from './authers'
import { CabinPricePeriodSchemas } from './schemas'
import { ServiceMethod } from '@/services/ServiceMethod'
import 'server-only'
import { CabinReleasePeriodMethods } from '@/services/cabin/releasePeriod/methods'
import { ServerError } from '@/services/error'
import { z } from 'zod'

export namespace CabinPricePeriodMethods {

    export const create = ServiceMethod({
        auther: () => CabinPricePeriodAuthers.create.dynamicFields({}),
        dataSchema: CabinPricePeriodSchemas.createPricePeriod,
        method: async ({ prisma, data }) => {
            const currentReleaseDate = await CabinReleasePeriodMethods.getCurrentReleasePeriod({ bypassAuth: true })

            if (currentReleaseDate && currentReleaseDate.releaseUntil >= data.validFrom) {
                throw new ServerError(
                    'BAD DATA',
                    'Kan ikke sette en pris periode til å være gyldig når datoene allerede er sluppet.'
                )
            }

            const latestPricePeriod = await prisma.pricePeriod.findFirst({
                orderBy: {
                    validFrom: 'desc',
                },
                take: 1,
            })

            if (latestPricePeriod && latestPricePeriod.validFrom >= data.validFrom) {
                throw new ServerError('BAD DATA', 'Kan ikke sette en pris periode til å være gyldig før en annen periode.')
            }

            const result = await prisma.pricePeriod.create({
                data: {
                    validFrom: data.validFrom
                }
            })

            if (data.copyPreviousPrices && latestPricePeriod) {
                const products = await prisma.cabinProductPrice.findMany({
                    where: {
                        pricePeriodId: latestPricePeriod.id,
                    }
                })
                console.log(products)

                await prisma.cabinProductPrice.createMany({
                    data: products.map(product => ({
                        ...product,
                        id: undefined,
                        pricePeriodId: result.id,
                    }))
                })
            }

            return result
        }
    })

    export const destroy = ServiceMethod({
        auther: () => CabinPricePeriodAuthers.destroy.dynamicFields({}),
        paramsSchema: z.object({
            id: z.number(),
        }),
        method: async ({ prisma, params }) => {
            const currentReleasePeriod = await CabinReleasePeriodMethods.getCurrentReleasePeriod({ bypassAuth: true })

            const pricePeriod = await prisma.pricePeriod.findUniqueOrThrow({
                where: params,
            })

            if (currentReleasePeriod && pricePeriod.validFrom <= currentReleasePeriod.releaseUntil) {
                throw new ServerError('BAD PARAMETERS', 'Kan ikke slette en pris periode som er publisert.')
            }

            return await prisma.pricePeriod.delete({
                where: params,
            })
        }
    })

    export const readMany = ServiceMethod({
        auther: () => CabinPricePeriodAuthers.read.dynamicFields({}),
        method: async ({ prisma }) => prisma.pricePeriod.findMany()
    })

    export const readPublicPeriods = ServiceMethod({
        auther: () => CabinPricePeriodAuthers.readPublicPeriods.dynamicFields({}),
        method: async ({ prisma }) => {
            const releaseDate = await CabinReleasePeriodMethods.getCurrentReleasePeriod({ bypassAuth: true })

            const [currentPeriod, futurePeriods] = await Promise.all([
                prisma.pricePeriod.findFirstOrThrow({
                    where: {
                        validFrom: {
                            lte: new Date(),
                        },
                    },
                    orderBy: {
                        validFrom: 'desc',
                    },
                    take: 1,
                }),
                prisma.pricePeriod.findMany({
                    where: {
                        validFrom: {
                            gt: new Date(),
                            ...(releaseDate ? {
                                lt: releaseDate.releaseUntil,
                            } : {})
                        }
                    }
                })
            ])

            return [currentPeriod, ...futurePeriods]
        }
    })

    export const readUnreleasedPeriods = ServiceMethod({
        auther: () => CabinPricePeriodAuthers.read.dynamicFields({}),
        method: async ({ prisma }) => {
            const releaseDate = await CabinReleasePeriodMethods.getCurrentReleasePeriod({ bypassAuth: true })
            return prisma.pricePeriod.findMany({
                where: {
                    validFrom: {
                        gte: releaseDate?.releaseUntil,
                    }
                }
            })
        }
    })

    export const update = ServiceMethod({
        auther: () => CabinPricePeriodAuthers.update.dynamicFields({}),
        dataSchema: CabinPricePeriodSchemas.updatePricePeriod,
        paramsSchema: z.object({
            pricePeriodId: z.number(),
        }),
        method: async ({ prisma, data, params }) => prisma.pricePeriod.update({
            where: {
                id: params.pricePeriodId,
            },
            data,
        })
    })
}
