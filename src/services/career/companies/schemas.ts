import { z } from 'zod'

const baseSchema = z.object({
    name: z.string().min(
        2, 'Navnet må være minst 3 tegn langt'
    ).max(
        100, 'Navnet kan maks være 100 tegn langt'
    ).trim(),
    description: z.string().max(
        200, 'Beskrivelsen kan maks være 200 tegn langt'
    ).trim(),
})

export const companySchemas = {
    create: baseSchema.pick({
        name: true,
        description: true,
    }),
    update: baseSchema.partial().pick({
        name: true,
        description: true,
    }),
}
