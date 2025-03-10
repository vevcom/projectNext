import type { Prisma } from '@prisma/client'


export namespace CabinProductConfig {

    export const includer = {
        CabinProductPrice: true,
    } as const

    export type CabinProductExtended = Prisma.CabinProductGetPayload<{
        include: {
            CabinProductPrice: true,
        }
    }>
}
