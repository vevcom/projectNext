import { ValidationBase } from '@/server/Validation'
import { z } from 'zod'
import type { ValidationTypes } from '@/server/Validation'


export const baseMailingListValidation = new ValidationBase({
    type: {
        id: z.string().or(z.number()),
        name: z.string(),
        description: z.string(),
    },
    details: {
        id: z.number().min(1),
        name: z.string().min(2).max(50),
        description: z.string().max(200),
    }
})

export const createMailingListValidation = baseMailingListValidation.createValidation({
    keys: [
        'name',
        'description',
    ],
    transformer: data => data
})
export type CreateMailingListTypes = ValidationTypes<typeof createMailingListValidation>

export const updateMailingListValidation = baseMailingListValidation.createValidation({
    keys: [
        'id',
        'name',
        'description',
    ],
    transformer: data => ({...data, id: Number(data.id)})
})
export type UpdateMailingListTypes = ValidationTypes<typeof updateMailingListValidation>

export const readMailingListValidation = baseMailingListValidation.createValidation({
    keys: [
        'id',
    ],
    transformer: data => ({
        id: Number(data.id),
    }),
})
export type ReadMailingListTypes = ValidationTypes<typeof readMailingListValidation>
