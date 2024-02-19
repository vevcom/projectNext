import { z } from "zod"

export const schema = z.object({
    name: z.string().max(20, 'max lengde 20').min(2, 'min lengde 2'),
    description: z.string().max(250, 'max lengde 250').min(2, 'min lengde 2'),
})