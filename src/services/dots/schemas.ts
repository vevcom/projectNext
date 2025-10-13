import { z } from 'zod'

const dotSchema = z.object({
    value: z.coerce.number().int().min(
        1, 'Verdi må være et positivt heltall'
    ).max(
        100, 'Verdi kan ikke være større enn 100'
    ),
    reason: z.string().max(200, 'Begrunnelse kan ha maks 200 tegn').trim(),
    userId: z.coerce.number().int(),
})

export const dotSchemas = {
    create: dotSchema.pick({
        value: true,
        reason: true,
        userId: true,
    }),
    update: dotSchema.partial().pick({
        value: true,
        reason: true,
    }),
}
