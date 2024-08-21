import 'server-only'

import { ValidationBase } from '@/server/Validation'
import { z } from 'zod'
import { Admission } from '@prisma/client'
import type { ValidationTypes } from '@/server/Validation'

export const baseAdmissionTrialValidation = new ValidationBase({
    type: {
        admission: z.nativeEnum(Admission),
        userId: z.number().or(z.string()),
        registeredBy: z.number()
    },
    details: {
        admission: z.nativeEnum(Admission),
        userId: z.number(),
        registeredBy: z.number(),
    }
})

export const createAdmissionTrialValidation = baseAdmissionTrialValidation.createValidation({
    keys: [
        'admission',
        'userId',
        'registeredBy',
    ],
    transformer: data => ({
        ...data,
        userId: Number(data.userId)
    }),
})
export type CreateAdmissionTrialType = ValidationTypes<typeof createAdmissionTrialValidation>
