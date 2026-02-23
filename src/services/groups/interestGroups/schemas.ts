import { z } from 'zod'

const baseSchema = z.object({
    name: z.string()
        .min(3, 'Navn må ha minst 3 tegn')
        .max(30, 'Navn kan ha maks 30 tegn')
        .trim(),
})

export const interestGroupSchemas = {
    create: baseSchema.pick({
        name: true,
    }),

    update: baseSchema.partial().pick({
        name: true,
    }),
}
