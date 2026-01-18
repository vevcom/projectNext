import { Zpn } from '@/lib/fields/zpn'
import { convertPrice } from '@/lib/money/convert'
import { BookingType } from '@/prisma-generated-pn-types'
import { z } from 'zod'

const baseSchema = z.object({
    type: z.nativeEnum(BookingType),
    amount: z.coerce.number().int().min(0),
    name: z.string().min(2),
    description: z.string().min(0).max(20),
    price: z.coerce.number().min(0).transform((val) => convertPrice(val)),
    validFrom: z.coerce.date(),
    cronInterval: Zpn.simpleCronExpression(),
    memberShare: z.coerce.number().min(0).max(100),
    pricePeriodId: z.coerce.number(),
})

export const cabinProductSchemas = {
    createProduct: baseSchema.pick({
        name: true,
        type: true,
        amount: true,
    }),

    createProductPrice: baseSchema.pick({
        description: true,
        price: true,
        cronInterval: true,
        memberShare: true,
        pricePeriodId: true,
    }),
}
