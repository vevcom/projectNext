import { ValidationBase } from '@/services/Validation'
import { z } from 'zod'

const baseBadgeValidation = new ValidationBase({
    type: {
        color: z.string(),
        name: z.string().trim(),
        description: z.string(),
    },
    details: {
        name: z.string().trim().min(
            4, "Navnet er må være minst 4 karakterer"
        ).max(
            20, "Navnet kan ikke være mer enn 20 karakterer"
        ),
        color: z.string().regex(
            /^#[0-9A-Fa-f]{6}$/, 'Farge må være en gyldig hex-farge'
        ).transform(value => value.toUpperCase()),
        description: z.string(),
    }
})

export const createBadgeValidation = baseBadgeValidation.createValidation({
    keys: ['name', 'color', 'description'],
    transformer: data => data,
})

export const updateBadgeValidation = baseBadgeValidation.createValidationPartial({
    keys: ['name', 'color', 'description'],
    transformer: data => data,
})
