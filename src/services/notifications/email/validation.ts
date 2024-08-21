import { ValidationBase } from '@/server/Validation'
import { z } from 'zod'
import type { ValidationTypes } from '@/server/Validation'

const baseEmailValidation = new ValidationBase({
    type: {
        from: z.string(),
        to: z.string(),
        subject: z.string(),
        text: z.string(),
    },
    details: {
        from: z.string().email('Ikke en gyldig e-post'),
        to: z.string().email('Ikke en gyldig e-post'),
        subject: z.string().min(2, 'Minimum 2 tegn').max(100, 'Maksimum 100 tegn'),
        text: z.string().min(2, 'Minimum 2 tegn'),
    }
})

export const sendEmailValidation = baseEmailValidation.createValidation({
    keys: [
        'from',
        'to',
        'subject',
        'text',
    ],
    transformer: data => data,
})
export type SendEmailValidation = ValidationTypes<typeof sendEmailValidation>
