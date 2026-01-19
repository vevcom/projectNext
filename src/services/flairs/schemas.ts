import { z } from 'zod'

const baseSchema = z.object({
    name: z.string().min(2, 'min length is 2').max(50, 'max length is 50'),
})

export const flairSchema = {
    create: baseSchema.pick({
        name: true,
    }),
    update: baseSchema.partial().pick({
        name: true,
    }),
} as const

