import { ValidationBase } from '@/services/Validation'
import { z } from 'zod'
import { zfd } from 'zod-form-data'
import { Permission } from '@prisma/client'
import type { ValidationTypes } from '@/services/Validation'

const baseApiKeyValidation = new ValidationBase({
    type: {
        name: z.string().min(10, 'minimum lengde 10').max(100, 'maksimum lengde 100'),
        expiresAt: z.string(),
        active: z.literal('on').optional(),
        permissions: zfd.repeatable(z.nativeEnum(Permission).array())
    },
    details: {
        name: z.string(),
        expiresAt: z.date(),
        active: z.boolean(),
        permissions: zfd.repeatable(z.nativeEnum(Permission).array())
    }
})

export const createApiKeyValidation = baseApiKeyValidation.createValidation({
    keys: ['name'],
    transformer: data => data
})
export type CreateApiKeyTypes = ValidationTypes<typeof createApiKeyValidation>

export const updateApiKeyValidation = baseApiKeyValidation.createValidationPartial({
    keys: ['name', 'expiresAt', 'active', 'permissions'],
    transformer: data => ({
        ...data,
        expiresAt: data.expiresAt ? new Date(data.expiresAt) : undefined,
        active: data.active === 'on'
    })
})
export type UpdateApiKeyTypes = ValidationTypes<typeof updateApiKeyValidation>
