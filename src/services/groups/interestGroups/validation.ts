import { ValidationBase } from '@/services/Validation'
import { z } from 'zod'

const baseInterestGroupValidation = new ValidationBase({
    type: {
        name: z.string(),
        shortName: z.string(),
    },
    details: {
        name: z.string().min(
            3, 'Navn må ha minst 3 tegn'
        ).max(
            30, 'Navn kan ha maks 30 tegn'
        ).trim(),
        shortName: z.string().min(
            3, 'Kortnavn må ha minst 3 tegn'
        ).max(
            10, 'Kortnavn kan ha maks 10 tegn'
        ).trim(),
    },
})

export const createInterestGroupValidation = baseInterestGroupValidation.createValidation({
    keys: ['name', 'shortName'],
    transformer: data => data
})

export const updateInterestGroupValidation = baseInterestGroupValidation.createValidationPartial({
    keys: ['name', 'shortName'],
    transformer: data => data
})
