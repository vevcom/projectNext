import { baseSchema as baseSchemaArticleSections } from '@/cms/articleSections/schemas'
import { SpecialCmsArticle } from '@prisma/client'
import { z } from 'zod'

const baseSchema = z.object({
    name: z.string().min(2, 'Minimum lengde er 2 tegn.').max(20, 'Maksimum lengde er 20 tegn.'),
    special: z.nativeEnum(SpecialCmsArticle).optional(),
    includeParts: z.record(baseSchemaArticleSections.shape.part, z.boolean()),
    direction: z.union([z.literal('UP'), z.literal('DOWN')])
})

export const articleSchemas = {
    create: baseSchema.pick({
        name: true,
        special: true
    }).partial(),
    update: baseSchema.pick({
        name: true,
    }).partial(),
    addSection: baseSchema.pick({
        includeParts: true
    }),
    reorderSections: baseSchema.pick({
        direction: true
    }),
    params: z.object({
        articleId: z.number()
    })
} as const
