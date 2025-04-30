import { zpn } from '@/lib/fields/zpn'
import { z } from 'zod'

export namespace CabinPricePeriodSchemas {
    const fields = z.object({
        id: z.coerce.number(),
        validFrom: z.coerce.date(),
        copyPreviousPrices: zpn.checkboxOrBoolean({ label: '' }),
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

