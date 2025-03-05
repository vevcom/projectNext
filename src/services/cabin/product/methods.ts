import { CabinProductAuthers } from './authers'
import { CabinProductSchemas } from './schemas'
import { ServiceMethod } from '@/services/ServiceMethod'
import 'server-only'
import { z } from 'zod'

export namespace CabinProductMethods {

    export const create = ServiceMethod({
        auther: () => CabinProductAuthers.createCabinProductAuther.dynamicFields({}),
        dataSchema: CabinProductSchemas.createProduct,
        method: ({ prisma, data }) => prisma.cabinProduct.create({
            data,
        })
    })

    export const createPrice = ServiceMethod({
        auther: () => CabinProductAuthers.createCabinProductPriceAuther.dynamicFields({}),
        paramsSchema: z.object({
            cabinProductId: z.number(),
        }),
        dataSchema: CabinProductSchemas.createProductPrice,
        method: ({ prisma, params, data }) => prisma.cabinProductPrice.create({
            data: {
                ...data,
                cabinProductId: params.cabinProductId
            }
        })
    })

    export const readMany = ServiceMethod({
        auther: () => CabinProductAuthers.readCabinProductAuther.dynamicFields({}),
        method: ({ prisma }) => prisma.cabinProduct.findMany(),
    })

    export const read = ServiceMethod({
        auther: () => CabinProductAuthers.readCabinProductAuther.dynamicFields({}),
        paramsSchema: z.object({
            id: z.number(),
        }),
        method: ({ prisma, params }) => prisma.cabinProduct.findUniqueOrThrow({
            where: params,
            include: {
                CabinProductPrice: true,
            }
        })
    })
}
