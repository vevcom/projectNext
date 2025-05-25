import { CabinProductAuthers } from './authers'
import { CabinProductSchemas } from './schemas'
import { CabinProductConfig } from './config'
import { ServiceMethod } from '@/services/ServiceMethod'
import 'server-only'
import { ServerError } from '@/services/error'
import { CabinReleasePeriodMethods } from '@/services/cabin/releasePeriod/methods'
import { CabinPricePeriodMethods } from '@/services/cabin/pricePeriod/methods'
import { z } from 'zod'

export namespace CabinProductMethods {

    export const create = ServiceMethod({
        auther: () => CabinProductAuthers.create.dynamicFields({}),
        dataSchema: CabinProductSchemas.createProduct,
        method: ({ prisma, data }) => prisma.cabinProduct.create({
            data,
        })
    })

    export const createPrice = ServiceMethod({
        auther: () => CabinProductAuthers.createPrice.dynamicFields({}),
        paramsSchema: z.object({
            cabinProductId: z.number(),
        }),
        dataSchema: CabinProductSchemas.createProductPrice,
        method: async ({ prisma, params, data, session }) => {
            const [pricePeriod, releasePeriod] = await Promise.all([
                prisma.pricePeriod.findUniqueOrThrow({
                    where: {
                        id: data.pricePeriodId,
                    }
                }),
                CabinReleasePeriodMethods.getCurrentReleasePeriod.client(prisma).execute({
                    bypassAuth: true,
                    session
                })
            ])

            if (releasePeriod && pricePeriod.validFrom <= releasePeriod.releaseUntil) {
                throw new ServerError('BAD PARAMETERS', 'Cannot change prices for a product that is released')
            }

            const result = await prisma.cabinProductPrice.create({
                data: {
                    ...data,
                    cabinProductId: params.cabinProductId,
                }
            })

            return result
        }
    })

    export const readMany = ServiceMethod({
        auther: () => CabinProductAuthers.read.dynamicFields({}),
        method: ({ prisma }) => prisma.cabinProduct.findMany({
            include: CabinProductConfig.includer,
        }),
    })

    export const readActive = ServiceMethod({
        auther: () => CabinProductAuthers.read.dynamicFields({}),
        method: async ({ prisma, session }) => {
            const pricePeriods = await CabinPricePeriodMethods.readPublicPeriods.client(prisma).execute({
                bypassAuth: true,
                session,
            })

            return await prisma.cabinProduct.findMany({
                where: {
                    CabinProductPrice: {
                        some: {
                            pricePeriodId: {
                                in: pricePeriods.map(period => period.id)
                            }
                        }
                    }
                },
                include: CabinProductConfig.includer,
            })
        },
    })

    export const read = ServiceMethod({
        auther: () => CabinProductAuthers.read.dynamicFields({}),
        paramsSchema: z.object({
            id: z.number(),
        }),
        method: ({ prisma, params }) => prisma.cabinProduct.findUniqueOrThrow({
            where: params,
            include: CabinProductConfig.includer
        })
    })
}
