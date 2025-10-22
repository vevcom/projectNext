import { SpecialCmsArticle } from '@prisma/client'
import { z } from 'zod'

const baseSchemas = z.object({
    name: z.string().min(2, 'Minimum lengde er 2 tegn.').max(20, 'Maksimum lengde er 20 tegn.'),
    special: z.nativeEnum(SpecialCmsArticle).optional()
})

export const articleSchemas = {
    create: baseSchemas.pick({
        name: true,
        special: true
    }).partial(),
    update: baseSchemas.pick({
        name: true,
    }).partial()
} as const
