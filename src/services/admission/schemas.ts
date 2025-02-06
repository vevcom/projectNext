import { z } from 'zod'

const admissionSchemaFields = z.object({
    userId: z.coerce.number(),
})

export const admissionSchemas = {
    createTrial: admissionSchemaFields.pick({
        userId: true,
    }),
} as const
