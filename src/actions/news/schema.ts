import { z } from 'zod'

const newsArticleSchema = z.object({
    name: z.string().max(25, 'max lengde 25').min(2, 'min lengde 2'),
    description: z.string().max(200, 'max lengde 200').min(2, 'min lengde 2').or(z.literal('')),
    endDateTime: z.string().optional().transform((val) => (val ? new Date(val) : null)),
})

export default newsArticleSchema
