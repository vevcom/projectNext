import { ValidationBase } from '@/server/Validation'
import { z } from 'zod'
import type { ValidationTypes } from '@/server/Validation'

export const baseArticleCategoryValidation = new ValidationBase({
    type: {
        name: z.string(),
        description: z.string(),
    },
    details: {
        name: z.string().min(2, 'Minmum lengde er 2.').max(18, 'Maks lengde er 2.').trim(),
        description: z.string().max(70, 'Maks lengde er 70.'),
    }
})

export const createArticleCategoryValidation = baseArticleCategoryValidation.createValidation({
    keys: ['name', 'description'],
    transformer: data => data
})
export type CreateArticleCategoryTypes = ValidationTypes<typeof createArticleCategoryValidation>

export const updateArticleCategoryValidation = baseArticleCategoryValidation.createValidationPartial({
    keys: ['name', 'description'],
    transformer: data => data
})
export type UpdateArticleCategoryTypes = ValidationTypes<typeof updateArticleCategoryValidation>
