import { zpn } from '@/lib/fields/zpn'
import { z } from 'zod'

const baseSchema = z.object({
    id: z.coerce.number(),
    validFrom: z.coerce.date(),
    copyPreviousPrices: zpn.checkboxOrBoolean({ label: '' }),
})

export const cabinPricePeriodSchemas = {
    createPricePeriod: baseSchema.pick({
        validFrom: true,
        copyPreviousPrices: true,
    }),
    updatePricePeriod: baseSchema.pick({
        id: true,
        validFrom: true,
    }),
}
