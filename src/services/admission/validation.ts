import { ValidationBase } from '@/services/Validation'
import { z } from 'zod'
import type { ValidationTypes } from '@/services/Validation'

export const baseAdmissionTrialValidation = new ValidationBase({
    type: {
        userId: z.coerce.number(),
    },
    details: {
        userId: z.coerce.number(),
    }
})

export const createAdmissionTrialValidation = baseAdmissionTrialValidation.createValidation({
    keys: ['userId'],
    transformer: data => data,
})

export type CreateAdmissionTrialType = ValidationTypes<typeof createAdmissionTrialValidation>
