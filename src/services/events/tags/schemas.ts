import { Zpn } from '@/lib/fields/zpn'
import { z } from 'zod'

const baseSchemas = z.object({
    name: z.string().min(3, 'Navn må ha minst 3 tegn').max(30, 'Navn kan ha maks 30 tegn').trim(),
    description: z.string().max(200, 'Beskrivelse kan ha maks 200 tegn').trim(),
    color: Zpn.colorInput()
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
