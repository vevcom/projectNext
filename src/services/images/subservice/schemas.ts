import { z } from 'zod'

const baseSchema = z.object({
    name: z.string(),
    description: z.string(),
    coverImageId: z.number().int().positive()
})

export const imageSchemas = {
    updateCollection: baseSchema.partial().pick({
        name: true,
        description: true,
        coverImageId: true,
    }),
    createCollection: baseSchema.pick({
        name: true,
        description: true,
    }),
} as const
