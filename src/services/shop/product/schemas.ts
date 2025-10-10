import { zpn } from '@/lib/fields/zpn'
import { convertPrice } from '@/lib/money/convert'
import { z } from 'zod'

const baseSchema = z.object({
    shopId: z.coerce.number().int(),
    name: z.string().min(3),
    description: z.string(),
    price: z.coerce.number().int().min(1).transform((val) => convertPrice(val)),
    barcode: z.string().or(z.number()).optional(),
    active: zpn.checkboxOrBoolean({ label: 'Active' }),
    productId: z.coerce.number().int(),
})

export const productSchemas = {
    create: baseSchema.pick({
        name: true,
        description: true,
        barcode: true,
    }),

    update: baseSchema.pick({
        productId: true,
        name: true,
        description: true,
        barcode: true,
    }),

    readByBarCode: baseSchema.pick({
        barcode: true,
        shopId: true,
    }),

    createForShop: baseSchema.pick({
        name: true,
        description: true,
        price: true,
        barcode: true,
    }),

    updateForShop: baseSchema.pick({
        name: true,
        description: true,
        price: true,
        barcode: true,
        active: true,
    }),

    createShopConnection: baseSchema.pick({
        shopId: true,
        productId: true,
        price: true,
    }),
}
