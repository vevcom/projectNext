import { ValidationBase } from '@/server/Validation'
import { z } from 'zod'
import type { ValidationTypes } from '@/server/Validation'

const baseEmailValidation = new ValidationBase({
    type: {
        sender: z.string(),
        recipient: z.string(),
        subject: z.string(),
        text: z.string(),
    },
    details: {
        sender: z.string().email("Ikke en gyldig epost"),
        recipient: z.string().email("Ikke en gyldig epost"),
        subject: z.string().min(2, "Minimum 2 tegn").max(100, "Maksimum 100 tegn"),
        text: z.string().min(2, "Minimum 2 tegn"),
    }
})

export const sendEmailValidation = baseEmailValidation.createValidation({
    keys: [
        'sender',
        'recipient',
        'subject',
        'text',
    ],
    transformer: data => data,
})
export type SendEmailValidation = ValidationTypes<typeof sendEmailValidation>
