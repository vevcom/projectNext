import { ValidationBase } from '@/server/Validation'
import { z } from 'zod'
import type { ValidationTypes } from '@/server/Validation'


export const baseMailAliasValidation = new ValidationBase({
    type: {
        id: z.string().or(z.number()),
        address: z.string(),
        description: z.string(),
    },
    details: {
        id: z.number().min(1),
        address: z.string().email(),
        description: z.string(),
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

export const updateMailAliasValidation = baseMailAliasValidation.createValidation({
    keys: [
        'id',
        'address',
        'description',
    ],
    transformer: data => ({...data, id: Number(data.id)})
})
export type UpdateMailAliasTypes = ValidationTypes<typeof updateMailAliasValidation>

export const destoryMailAliasValidation = baseMailAliasValidation.createValidation({
    keys: [
        'id',
    ],
    transformer: data => ({
        id: Number(data.id),
    }),
})
export type DestoryMailAliasTypes = ValidationTypes<typeof destoryMailAliasValidation>
