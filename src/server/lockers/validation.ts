import { ValidationBase } from '@/server/Validation'
import { z } from 'zod'
import type { ValidationTypes } from '@/server/Validation'


export const baseLockerValidation = new ValidationBase({
    type: {
        location: z.string()
    },
    details: {
        location: z.string()
    }
})


export const createLockerValidation = baseLockerValidation.createValidation({
    keys: [
        'location',
        ],
    transformer: data => data
})

export type CreateLockerTypes = ValidationTypes<typeof createLockerValidation>

