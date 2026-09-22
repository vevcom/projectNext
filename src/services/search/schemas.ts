import { z } from 'zod'

const searchQuery = z.object({
    query: z.string().trim().min(1).max(100),
    limit: z.number().int().min(1).max(25)
        .optional(),
})

export const searchSchemas = {
    searchUsers: searchQuery,
    searchEvents: searchQuery,
}
