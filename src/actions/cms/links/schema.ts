import { z } from 'zod'
import { zfd } from 'zod-form-data'

export const articleLinkSchema = zfd.formData({
    text: z.string().min(2, 'Linken må ha navn på mer enn 1 bokstav').max(30, 'Max lengde er 30'),
    url: z.string().refine(value => {
        try {
            const url = new URL(value)
            return url
        } catch (_) {
            return value.startsWith('/') || value.includes('.')
        }
    }, {
        message: 'Invalid URL',
    })
})

export type ArticleLinkSchemaType = z.infer<typeof articleLinkSchema>
