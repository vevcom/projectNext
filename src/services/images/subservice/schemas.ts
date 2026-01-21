import { z } from "zod";

const baseSchema = z.object({
    name: z.string(),
    description: z.string(),
})

export const imageSchemas = {
    updateCollection: baseSchema.partial().pick({
        name: true,
        description: true,
    }),
}