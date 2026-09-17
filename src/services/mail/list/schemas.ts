import { z } from 'zod'

export const mailingListSchemas = {
    create: z.object({
        name: z.string().min(2).max(50),
        description: z.string().max(200),
    }),

    update: z.object({
        id: z.coerce.number().min(1),
        name: z.string().min(2).max(50),
        description: z.string().max(200),
    }),

    destroy: z.object({
        id: z.coerce.number().min(1),
    }),
}
