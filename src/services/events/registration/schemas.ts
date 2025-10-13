import '@pn-server-only'
import { z } from 'zod'

const baseSchema = z.object({
    note: z.string().max(200, 'Merknader kan ha maks 200 tegn'),
    name: z.string().min(2),
})

export const eventRegistrationSchemas = {
    updateNotes: baseSchema.pick({
        note: true,
    }),

    createGuest: baseSchema.pick({
        name: true,
        note: true,
    })
}
