import { ServiceMethod } from '@/services/ServiceMethod'
import 'server-only'
import { readCabinProductAuther } from '@/services/cabin/authers'
import { z } from 'zod'


export const readCabinProducts = ServiceMethod({
    auther: () => readCabinProductAuther.dynamicFields({}),
    method: ({ prisma }) => prisma.cabinProduct.findMany(),
})

export const readCabinProduct = ServiceMethod({
    auther: () => readCabinProductAuther.dynamicFields({}),
    paramsSchema: z.object({
        id: z.number(),
    }),
    method: ({ prisma, params }) => prisma.cabinProduct.findUniqueOrThrow({
        where: {
            id: params.id,
        },
        include: {
            CabinProductPrice: true,
        }
    })
})
