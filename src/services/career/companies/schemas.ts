import { z } from 'zod'

const companySchemaFields = z.object({
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
    create: companySchemaFields.pick({
        name: true,
        description: true,
    }),
    update: companySchemaFields.partial().pick({
        name: true,
        description: true,
    }),
} as const
