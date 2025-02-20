import { z } from 'zod'

const interestGroupSchemaFields = z.object({
    name: z.string().min(
        3, 'Navn må ha minst 3 tegn'
    ).max(
        30, 'Navn kan ha maks 30 tegn'
    ).trim(),
    shortName: z.string().min(
        3, 'Kortnavn må ha minst 3 tegn'
    ).max(
        10, 'Kortnavn kan ha maks 10 tegn'
    ).trim(),
})

export const interestGroupSchemas = {
    create: interestGroupSchemaFields.pick({
        name: true,
        shortName: true,
    }),
    update: interestGroupSchemaFields.partial().pick({
        name: true,
        shortName: true,
    }),
} as const
