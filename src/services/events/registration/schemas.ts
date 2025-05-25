import '@pn-server-only'
import { z } from 'zod'

export namespace EventRegistrationSchemas {
    const fields = z.object({
        note: z.string().max(200, 'Merknader kan ha maks 200 tegn'),
        name: z.string().min(2),
    })

    export const updateNotes = fields.pick({
        note: true,
    })

    export const createGuest = fields.pick({
        name: true,
        note: true,
    })
}
