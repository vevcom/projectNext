import { Validation } from '@/server/Validation'
import { z } from 'zod'
import type { ValidationType } from '@/server/Validation'

export const baseArticleCategorySchema = new Validation({
    name: z.string(),
    description: z.string(),
}, {
    name: z.string().min(2, 'Minmum lengde er 2.').max(18, 'Maks lengde er 2.').trim(),
    description: z.string().max(70, 'Maks lengde er 70.'),
})

export const createArticleCategorySchema = baseArticleCategorySchema

export type CreateArticleCategoryType = ValidationType<typeof createArticleCategorySchema>

export const updateArticleCategorySchema = baseArticleCategorySchema.partialize()

export type UpdateArticleCategoryType = ValidationType<typeof updateArticleCategorySchema>
