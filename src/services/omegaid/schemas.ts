import { z } from 'zod'

export const omegaIdSchemas = {
    generate: z.object({
        userId: z.number(),
    }),
}
