import { ValidationBase } from '@/server/Validation'
import { z } from 'zod'
import type { ValidationTypes } from '@/server/Validation'

export const baseOmegaquotesValidation = new ValidationBase({
    type: {
        quote: z.string(),
        author: z.string(),
    },
    details: {
        quote: z.string().min(1, 'Sitatet kan ikke være tomt'),
        author: z.string().min(1, 'Noen må siteres'),
    }
})

export const createOmegaquotesValidation = baseOmegaquotesValidation.createValidation({
    keys: ['quote', 'author'],
    transformer: data => data
})
export type CreateOmegaguotesTypes = ValidationTypes<typeof createOmegaquotesValidation>
