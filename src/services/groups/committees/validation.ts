import { z } from 'zod'

const baseSchema = z.object({
    name: z.string().max(32).min(1).trim(),
    shortName: z.string().max(32).min(1).trim(),
    logoImageId: z.coerce.number().optional(),
})

export const committeeSchemas = {
    create: baseSchema.pick({
        name: true,
        shortName: true,
        logoImageId: true
    }),
    update: baseSchema.pick({
        name: true,
        shortName: true,
        logoImageId: true
    }).partial()
}
