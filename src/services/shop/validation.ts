import { convertPrice } from '@/lib/money/convert'
import { ValidationBase } from '@/services/Validation'
import { z } from 'zod'

const baseShopValidation = new ValidationBase({
    type: {
        shopId: z.coerce.number(),
        name: z.string(),
        description: z.string(),
        price: z.number().or(z.string()),
    },
    details: {
        shopId: z.coerce.number().int(),
        name: z.string().min(3),
        description: z.string(),
        price: z.number().int().min(0),
    }
})

export const createShopValidation = baseShopValidation.createValidation({
    keys: ['name', 'description'],
    transformer: data => data,
})

export const updateShopValidation = createShopValidation

export const createProductValidation = baseShopValidation.createValidation({
    keys: ['name', 'description'],
    transformer: data => data,
})

export const updateProductValidation = createShopValidation

export const createProductForShopValidation = baseShopValidation.createValidation({
    keys: ['name', 'description', 'price'],
    transformer: data => ({
        ...data,
        price: convertPrice(data.price)
    })
})
