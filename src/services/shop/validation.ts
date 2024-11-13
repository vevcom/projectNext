import { ValidationBase } from '@/services/Validation'
import { z } from 'zod'

const baseShopValidation = new ValidationBase({
    type: {
        shopId: z.coerce.number(),
        name: z.string(),
        description: z.string(),
    },
    details: {
        shopId: z.coerce.number().int(),
        name: z.string(),
        description: z.string(),
    }
})

export const createShopValidation = baseShopValidation.createValidation({
    keys: ['name', 'description'],
    transformer: data => data,
})

export const updateShopValidation = createShopValidation

