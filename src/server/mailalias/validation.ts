import { ValidationBase } from '@/server/Validation'
import { z } from 'zod'
import type { ValidationTypes } from '@/server/Validation'

export const baseMailAliasValidation = new ValidationBase({
    type: {
        id: z.string().or(z.number()),
        address: z.string(),
        description: z.string().or(z.literal('')),
        rawAddress: z.string(),
    },
    details: {
        id: z.number().min(1),
        address: z.string().email(),
        description: z.string().max(200, 'max lengde 200').min(2, 'min lengde 2').or(z.literal('')),
        rawAddress: z.string().email(),
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

export const createMailAliasRawAddressValidation = baseMailAliasValidation.createValidation({
    keys: [
        'id',
        'rawAddress',
    ],
    transformer: data => ({
        id: Number(data.id),
        rawAddress: data.rawAddress ?? "",
    })
})
export type CreateMailAliasRawAddressTypes = ValidationTypes<typeof createMailAliasRawAddressValidation>

export const destoryMailAliasValidation = baseMailAliasValidation.createValidation({
    keys: [
        'id',
    ],
    transformer: data => ({
        id: Number(data.id),
    }),
})
export type DestoryMailAliasTypes = ValidationTypes<typeof destoryMailAliasValidation>
