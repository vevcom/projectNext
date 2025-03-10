import { ValidationBase } from '@/services/Validation'
import { z } from 'zod'
import type { ValidationTypes } from '@/services/Validation'

const basePayoutValidation = new ValidationBase({
    details: {
        amount: z.coerce.number().int().positive(),
    },
    type: {
        amount: z.coerce.number(),
    }
})

export const createPayoutValidation = basePayoutValidation.createValidation({
    keys: ['amount'],
    transformer: data => data,
})

export type CreatePayoutTypes = ValidationTypes<typeof createPayoutValidation>
