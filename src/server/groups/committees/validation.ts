import { ValidationBase } from '@/server/Validation'
import { z } from 'zod'
import type { ValidationTypes } from '@/server/Validation'

const baseCommitteeValidation = new ValidationBase({
    type: {
        name: z.string(),
        shortName: z.string(),
        logoImageId: z.string().optional(),
    },
    details: {
        name: z.string().max(32).min(1).trim(),
        shortName: z.string().max(32).min(1).trim(),
        logoImageId: z.number().optional(),
    }
})

export const createCommitteeValidation = baseCommitteeValidation.createValidation({
    keys: ['name', 'shortName', 'logoImageId'],
    transformer: data => ({
        ...data,
        logoImageId: data.logoImageId ? parseInt(data.logoImageId) : undefined
    })
})
export type CreateCommitteeTypes = ValidationTypes<typeof createCommitteeValidation>

export const updateCommitteeValidation = baseCommitteeValidation.createValidationPartial({
    keys: ['name', 'shortName', 'logoImageId'],
    transformer: data => ({
        ...data,
        logoImageId: data.logoImageId ? parseInt(data.logoImageId) : undefined
    })
})
export type UpdateCommitteeTypes = ValidationTypes<typeof updateCommitteeValidation>
