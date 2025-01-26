import { ServiceMethod } from '@/services/ServiceMethod'
import 'server-only'
import { createCabinProductAuther, createCabinProductPriceAuther } from '@/services/cabin/authers'
import { createCabinProductPriceValidation, createCabinProductValidation } from '@/services/cabin/validation'
import { z } from 'zod'

export const createCabinProduct = ServiceMethod({
    auther: () => createCabinProductAuther.dynamicFields({}),
    dataValidation: createCabinProductValidation,
    method: ({ prisma, data }) => prisma.cabinProduct.create({
        data,
    })
})

export const createCabinProductPrice = ServiceMethod({
    auther: () => createCabinProductPriceAuther.dynamicFields({}),
    paramsSchema: z.object({
        cabinProductId: z.number(),
    }),
    dataValidation: createCabinProductPriceValidation,
    method: ({ prisma, params, data }) => prisma.cabinProductPrice.create({
        data: {
            cabinProductId: params.cabinProductId,
            cronInterval: data.cronInterval,
            validFrom: data.validFrom,
            price: data.price,
            description: data.description,
        }
    })
})
