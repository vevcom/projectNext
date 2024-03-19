import { Validation } from '@/server/Validation'
import { z } from 'zod'
import type { ValidationType } from '@/server/Validation'

export const baseArticleSectionSchema = new Validation({
    name: z.string(),
}, {
    name: z.string().max(20, 'Maks lengde er 20 tegn.'),
})

export const createArticleSectionSchema = baseArticleSectionSchema

export type CreateArticleSectionType = ValidationType<typeof createArticleSectionSchema>
