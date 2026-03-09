import type { Prisma } from '@/prisma-generated-pn-types'

export const cabinProductPriceIncluder = {
    CabinProductPrice: {
        include: {
            PricePeriod: true
        }
    }
} as const

export type CabinProductExtended = Prisma.CabinProductGetPayload<{
    include: typeof cabinProductPriceIncluder
}>

export type CabinProductPriceExtended = Prisma.CabinProductPriceGetPayload<{
    include: typeof cabinProductPriceIncluder.CabinProductPrice.include
}>
