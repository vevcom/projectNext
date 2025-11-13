import { z } from 'zod'

const baseSchemas = z.object({
    name: z.string().min(3, 'Navn må ha minst 3 tegn').max(30, 'Navn kan ha maks 30 tegn').trim(),
    description: z.string().max(200, 'Beskrivelse kan ha maks 200 tegn').trim(),
    color: z.string().regex(
        /^#[0-9A-Fa-f]{6}$/, 'Farge må være en gyldig hex-farge'
    ).transform(value => value.toUpperCase()),
})

export const eventTagSchemas = {
    create: baseSchemas.pick({
        name: true,
        description: true,
        color: true,
    }),
    update: baseSchemas.partial().pick({
        name: true,
        description: true,
        color: true,
    }),
}
