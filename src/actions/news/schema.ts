import { z } from 'zod'

export const schema = z.object({
    name: z.string().max(25, 'max lengde 25').min(2, 'min lengde 2'),
    description: z.string().max(250, 'max lengde 250').min(2, 'min lengde 2'),
})
