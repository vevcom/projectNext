import 'server-only'

import { ValidationBase } from '@/server/Validation'
import { z } from 'zod'
import type { ValidationTypes } from '@/server/Validation'

export const baseAuthValidation = new ValidationBase({
    type: {
        email: z.string(),
    },
    details: {
        email: z.string().email(),
    }
})

export const resetPasswordValidation = baseAuthValidation.createValidation({
    keys: [
        'email',
    ],
    transformer: data => data,
})
export type ResetPasswordType = ValidationTypes<typeof resetPasswordValidation>
