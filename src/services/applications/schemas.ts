import { z } from 'zod'

const baseSchema = z.object({
    text: z.string().trim().min(
        1, { message: 'Søknadsteksten kan ikke være tom.' }
    ).max(
        1000, { message: 'Søknadsteksten kan ikke være lengre enn 1000 tegn.' }
    ),
    priority: z.literal('UP').or(z.literal('DOWN'))
})

export const applicationSchemas = {
    create: baseSchema.pick({
        text: true,
    }),

    update: baseSchema.pick({
        text: true,
        priority: true
    }).partial(),
}
