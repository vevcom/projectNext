import 'server-only'

import { ValidationBase } from '@/server/Validation'
import { z } from 'zod'
import type { ValidationTypes } from '@/server/Validation'

export const baseAdmissionTrialValidation = new ValidationBase({
    type: {
        admissionId: z.number(),
        userId: z.number().or(z.string()),
        registeredBy: z.number()
    },
    details: {
        admissionId: z.number(),
        userId: z.number(),
        registeredBy: z.number(),
    }
})

export const createAdmissionTrialValidation = baseAdmissionTrialValidation.createValidation({
    keys: [
        'admissionId',
        'userId',
        'registeredBy',
    ],
    transformer: data => ({
        ...data,
        userId: Number(data.userId)
    }),
})
export type CreateAdmissionTrialType = ValidationTypes<typeof createAdmissionTrialValidation>
