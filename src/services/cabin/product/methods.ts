import { CabinProductAuthers } from './authers'
import { CabinProductSchemas } from './schemas'
import { CabinProductConfig } from './config'
import { ServiceMethod } from '@/services/ServiceMethod'
import 'server-only'
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
        method: ({ prisma, params, data }) => prisma.cabinProductPrice.create({
            data: {
                ...data,
                cabinProductId: params.cabinProductId,
            }
        })
    })

    export const readMany = ServiceMethod({
        auther: () => CabinProductAuthers.read.dynamicFields({}),
        method: ({ prisma }) => prisma.cabinProduct.findMany({
            include: CabinProductConfig.includer,
        }),
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
