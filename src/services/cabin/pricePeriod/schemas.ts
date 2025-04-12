import { z } from 'zod'

export namespace CabinPricePeriodSchemas {
    const fields = z.object({
        id: z.coerce.number(),
        validFrom: z.coerce.date(),
    })

    export const createPricePeriod = fields.pick({
        validFrom: true,
    })

    export const updatePricePeriod = fields.pick({
        id: true,
        validFrom: true,
    })
}

