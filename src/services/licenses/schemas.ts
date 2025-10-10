import { z } from 'zod'

const baseSchema = z.object({
    name: z.string().min(
        5, 'Navn må være minst 5 tegn langt'
    ).max(
        50, 'Navn kan maks være 50 tegn langt'
    ),
    link: z.string().min(
        1, 'Link må være minst 1 tegn langt'
    )
})

export const licenseSchemas = {
    create: baseSchema.pick({
        name: true,
        link: true,
    }),
    update: baseSchema.partial().pick({
        name: true,
        link: true,
    }),
}
