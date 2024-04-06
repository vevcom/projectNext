import { ValidationBase } from '@/server/Validation'
import { z } from 'zod'
import type { ValidationTypes } from '@/server/Validation'

export const baseMailAliasValidation = new ValidationBase({
    type: {
        address: z.string(),
        description: z.string().or(z.literal('')),
    },
    details: {
        address: z.string().email(),
        description: z.string().max(200, 'max lengde 200').min(2, 'min lengde 2').or(z.literal('')),
    }
})

export const createMailAliasValidation = baseMailAliasValidation.createValidation({
    keys: [
        'address',
        'description',
    ],
    transformer: data => data
})
export type CreateMailAliasTypes = ValidationTypes<typeof createMailAliasValidation>
