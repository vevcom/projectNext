import { Validation } from '@/server/Validation'
import { z } from 'zod'
import type { ValidationType } from '@/server/Validation'

export const baseArticleSchema = new Validation({
    name: z.string(),
}, {
    name: z.string().min(2, 'Minimum lengde er 2 tegn.').max(20, 'Maksimum lengde er 20 tegn.'),
})

export const createArticleSchema = baseArticleSchema.partialize()

export type CreateArticleType = ValidationType<typeof createArticleSchema>

export const updateArticleSchema = baseArticleSchema.partialize()

export type UpdateArticleType = ValidationType<typeof updateArticleSchema>
