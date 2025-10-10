import type { Prisma } from '@prisma/client'

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
