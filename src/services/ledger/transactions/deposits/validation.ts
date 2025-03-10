import { ValidationBase } from '@/services/Validation'
import { z } from 'zod'
import type { ValidationTypes } from '@/services/Validation'

const baseDepositValidation = new ValidationBase({
    details: {
        amount: z.coerce.number().int().positive(),
    },
    type: {
        amount: z.coerce.number(),
    }
})

export const createDepositValidation = baseDepositValidation.createValidation({
    keys: ['amount'],
    transformer: data => data,
})

export type CreateDepositTypes = ValidationTypes<typeof createDepositValidation>
