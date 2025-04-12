import { z } from 'zod'

export namespace CabinPricePeriodSchemas {
    const fields = z.object({
        id: z.coerce.number(),
        validFrom: z.coerce.date(),
        copyPreviousPrices: z.literal('on').optional().transform(val => val === 'on'),
    })

    export const createPricePeriod = fields.pick({
        validFrom: true,
        copyPreviousPrices: true,
    })

    export const updatePricePeriod = fields.pick({
        id: true,
        validFrom: true,
    })
}

