import { convertPrice } from '@/lib/money/convert'
import { z } from 'zod'

export namespace ProductSchemas {
    const fields = z.object({
        shopId: z.coerce.number().int(),
        name: z.string().min(3),
        description: z.string(),
        price: z.coerce.number().int().min(1).transform((val) => convertPrice(val)),
        barcode: z.string().or(z.number()).optional(),
        active: z.boolean().or(z.enum(['on'])).optional().transform((val) => val === 'on' || val === true),
        productId: z.coerce.number().int(),
    })

    export const create = fields.pick({
        name: true,
        description: true,
        barcode: true,
    })

    export const update = fields.pick({
        productId: true,
        name: true,
        description: true,
        barcode: true,
    })

    export const readByBarCode = fields.pick({
        barcode: true,
        shopId: true,
    })

    export const createForShop = fields.pick({
        name: true,
        description: true,
        price: true,
        barcode: true,
    })

    export const updateForShop = fields.pick({
        name: true,
        description: true,
        price: true,
        barcode: true,
        active: true,
    })

    export const createShopConnection = fields.pick({
        shopId: true,
        productId: true,
        price: true,
    })
}

