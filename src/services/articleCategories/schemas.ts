import { z } from 'zod'

const baseSchema = z.object({
    name: z.string().min(2, 'Minmum lengde er 2.').max(18, 'Maks lengde er 2.').trim(),
    description: z.string().max(70, 'Maks lengde er 70.'),
})

export const articleCategorySchemas = {
    create: baseSchema.pick({
        name: true,
        description: true
    }),
    update: baseSchema.pick({
        name: true,
        description: true
    }).partial()
} as const