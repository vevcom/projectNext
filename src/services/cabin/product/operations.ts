import 'server-only'

import { cabinProductAuth } from './auth'
import { cabinProductSchemas } from './schemas'
import { cabinProductPriceIncluder } from './constants'
import { cabinReleasePeriodOperations } from '@/services/cabin/releasePeriod/operations'
import { defineOperation } from '@/services/serviceOperation'
import { ServerError } from '@/services/error'
import { cabinPricePeriodOperations } from '@/services/cabin/pricePeriod/operations'
import { z } from 'zod'

export const cabinProductOperations = {

    create: defineOperation({
        authorizer: () => cabinProductAuth.create.dynamicFields({}),
        dataSchema: cabinProductSchemas.createProduct,
        operation: ({ prisma, data }) => prisma.cabinProduct.create({
            data,
        })
    }),

    createPrice: defineOperation({
        authorizer: () => cabinProductAuth.createPrice.dynamicFields({}),
        paramsSchema: z.object({
            cabinProductId: z.number(),
        }),
        dataSchema: cabinProductSchemas.createProductPrice,
        operation: async ({ prisma, params, data, session }) => {
            const [pricePeriod, releasePeriod] = await Promise.all([
                prisma.pricePeriod.findUniqueOrThrow({
                    where: {
                        id: data.pricePeriodId,
                    }
                }),
                cabinReleasePeriodOperations.getCurrentReleasePeriod({
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

    readMany: defineOperation({
        authorizer: () => cabinProductAuth.read.dynamicFields({}),
        operation: ({ prisma }) => prisma.cabinProduct.findMany({
            include: cabinProductPriceIncluder,
        }),
    }),

    readActive: defineOperation({
        authorizer: () => cabinProductAuth.read.dynamicFields({}),
        operation: async ({ prisma }) => {
            const pricePeriods = await cabinPricePeriodOperations.readPublicPeriods({ bypassAuth: true })

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

    read: defineOperation({
        authorizer: () => cabinProductAuth.read.dynamicFields({}),
        paramsSchema: z.object({
            id: z.number(),
        }),
        operation: ({ prisma, params }) => prisma.cabinProduct.findUniqueOrThrow({
            where: params,
            include: cabinProductPriceIncluder,
        })
    }),
}
