import 'server-only'

import { cabinProductAuthers } from './authers'
import { cabinProductSchemas } from './schemas'
import { cabinProductPriceIncluder } from './config'
import { cabinReleasePeriodMethods } from '@/services/cabin/releasePeriod/methods'
import { serviceMethod } from '@/services/serviceMethod'
import { ServerError } from '@/services/error'
import { cabinPricePeriodMethods } from '@/services/cabin/pricePeriod/methods'
import { z } from 'zod'

export const cabinProductMethods = {

    create: serviceMethod({
        authorizer: () => cabinProductAuthers.create.dynamicFields({}),
        dataSchema: cabinProductSchemas.createProduct,
        method: ({ prisma, data }) => prisma.cabinProduct.create({
            data,
        })
    }),

    createPrice: serviceMethod({
        authorizer: () => cabinProductAuthers.createPrice.dynamicFields({}),
        paramsSchema: z.object({
            cabinProductId: z.number(),
        }),
        dataSchema: cabinProductSchemas.createProductPrice,
        method: async ({ prisma, params, data, session }) => {
            const [pricePeriod, releasePeriod] = await Promise.all([
                prisma.pricePeriod.findUniqueOrThrow({
                    where: {
                        id: data.pricePeriodId,
                    }
                }),
                cabinReleasePeriodMethods.getCurrentReleasePeriod({
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
    }),

    readMany: serviceMethod({
        authorizer: () => cabinProductAuthers.read.dynamicFields({}),
        method: ({ prisma }) => prisma.cabinProduct.findMany({
            include: cabinProductPriceIncluder,
        }),
    }),

    readActive: serviceMethod({
        authorizer: () => cabinProductAuthers.read.dynamicFields({}),
        method: async ({ prisma }) => {
            const pricePeriods = await cabinPricePeriodMethods.readPublicPeriods({ bypassAuth: true })

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
                include: cabinProductPriceIncluder,
            })
        },
    }),

    read: serviceMethod({
        authorizer: () => cabinProductAuthers.read.dynamicFields({}),
        paramsSchema: z.object({
            id: z.number(),
        }),
        method: ({ prisma, params }) => prisma.cabinProduct.findUniqueOrThrow({
            where: params,
            include: cabinProductPriceIncluder,
        })
    }),
}
