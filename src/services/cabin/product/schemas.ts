import { BookingType } from '@prisma/client'
import { z } from 'zod'


export namespace CabinProductSchemas {
    const fields = z.object({
        type: z.nativeEnum(BookingType),
        amount: z.coerce.number().int().min(0),
        name: z.string().min(5),
        description: z.string().min(2).max(20),
        price: z.coerce.number().min(0),
        validFrom: z.date(),
        cronInterval: z.string().optional(),
    })

    export const createProduct = fields.pick({
        name: true,
        type: true,
        amount: true,
    })

    export const createProductPrice = fields.pick({
        description: true,
        price: true,
        validFrom: true,
        cronInterval: true,
    })
}

