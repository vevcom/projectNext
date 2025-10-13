import { z } from 'zod'

const baseSchema = z.object({
    userId: z.coerce.number(),
})

export const admissionSchemas = {
    createTrial: baseSchema.pick({
        userId: true,
    })
}
