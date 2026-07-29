import { z } from 'zod'

const baseSchema = z.object({
    name: z.string().optional(),
    markdown: z.string()
})

export const cmsParagraphSchemas = {
    create: baseSchema.pick({ name: true }),
    update: baseSchema.pick({ name: true }).partial(),
    updateContent: baseSchema.pick({ markdown: true })
} as const
