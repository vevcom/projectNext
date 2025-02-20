import { z } from 'zod'

const dotSchemaFields = z.object({
    value: z.coerce.number().int().min(
        1, 'Verdi må være et positivt heltall'
    ).max(
        100, 'Verdi kan ikke være større enn 100'
    ),
    reason: z.string().max(200, 'Begrunnelse kan ha maks 200 tegn').trim(),
    userId: z.coerce.number().int(),
})

export const dotSchemas = {
    create: dotSchemaFields.pick({
        value: true,
        reason: true,
        userId: true,
    }),
    update: dotSchemaFields.partial().pick({
        value: true,
        reason: true,
    }),
} as const
