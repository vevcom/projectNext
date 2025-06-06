import { zpn } from '@/lib/fields/zpn'
import { convertPrice } from '@/lib/money/convert'
import { BookingType } from '@prisma/client'
import { z } from 'zod'


export namespace CabinProductSchemas {
    const fields = z.object({
        type: z.nativeEnum(BookingType),
        amount: z.coerce.number().int().min(0),
        name: z.string().min(2),
        description: z.string().min(0).max(20),
        price: z.coerce.number().min(0).transform((val) => convertPrice(val)),
        validFrom: z.coerce.date(),
        cronInterval: zpn.simpleCronExpression(),
        memberShare: z.coerce.number().min(0).max(100),
        pricePeriodId: z.coerce.number(),
    })

    export const createProduct = fields.pick({
        name: true,
        type: true,
        amount: true,
    })

    export const createProductPrice = fields.pick({
        description: true,
        price: true,
        cronInterval: true,
        memberShare: true,
        pricePeriodId: true,
    })
}

