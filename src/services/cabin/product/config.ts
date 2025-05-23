import type { Prisma } from '@prisma/client'


export namespace CabinProductConfig {

    export const includer = {
        CabinProductPrice: {
            include: {
                PricePeriod: true
            }
        }
    } as const

    export type CabinProductExtended = Prisma.CabinProductGetPayload<{
        include: typeof includer
    }>

    export type CabinProductPriceExtended = Prisma.CabinProductPriceGetPayload<{
        include: typeof includer.CabinProductPrice.include
    }>
}
