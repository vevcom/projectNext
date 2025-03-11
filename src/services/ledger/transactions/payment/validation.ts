import { ValidationBase } from '@/services/Validation'
import { z } from 'zod'
import type { ValidationTypes } from '@/services/Validation'

const basePaymentValidation = new ValidationBase({
    details: {
        amount: z.coerce.number().int().positive(),
        toAccountId: z.coerce.number().int(),
    },
    type: {
        amount: z.coerce.number(),
        toAccountId: z.coerce.number(),
    }
})

export const createPaymentValidation = basePaymentValidation.createValidation({
    keys: ['amount', 'toAccountId'],
    transformer: data => data,
})

export type CreatePaymentTypes = ValidationTypes<typeof createPaymentValidation>
