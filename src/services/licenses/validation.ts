import { ValidationBase } from '@/services/Validation'
import { z } from 'zod'
import type { ValidationTypes } from '@/services/Validation'

export const baseLicenseValidation = new ValidationBase({
    type: {
        name: z.string(),
        link: z.string(),
    },
    details: {
        name: z.string().min(
            5, 'Navn må være minst 5 tegn langt'
        ).max(
            50, 'Navn kan maks være 50 tegn langt'
        ),
        link: z.string().min(
            1, 'Link må være minst 1 tegn langt'
        )
    }
})

export const createLicenseValidation = baseLicenseValidation.createValidation({
    keys: ['name', 'link'],
    transformer: data => data
})
export type CreateLicenseTypes = ValidationTypes<typeof createLicenseValidation>

export const updateLicenseValidation = baseLicenseValidation.createValidationPartial({
    keys: ['name', 'link'],
    transformer: data => data
})

