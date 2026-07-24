import { baseSchema as baseSchemaArticleSections } from '@/cms/articleSections/schemas'
import { z } from 'zod'

const baseSchema = z.object({
    name: z.string().min(2, 'Minimum lengde er 2 tegn.').max(30, 'Maksimum lengde er 30 tegn.'),
    includeParts: z.record(baseSchemaArticleSections.shape.part, z.boolean()),
    direction: z.union([z.literal('UP'), z.literal('DOWN')])
})

export const articleSchemas = {
    create: baseSchema.pick({
        name: true,
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
