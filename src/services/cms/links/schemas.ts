import { SpecialCmsLink } from '@prisma/client'
import { z } from 'zod'

const cmsLinkRefiner = {
    fcn: (url: string | undefined): boolean => {
        if (!url) return true
        try {
            const urlObject = new URL(url)
            return Boolean(urlObject)
        } catch {
            return url.startsWith('/') || url.includes('.')
        }
    },
    message: 'Ugyldig URL.'
}

const baseSchema = z.object({
    name: z.string().optional(),
    text: z.string().min(1, 'Linken må ha tekst på mer enn 1 bokstav').max(30, 'Max lengde er 30'),
    url: z.string().refine(cmsLinkRefiner.fcn, {
        message: cmsLinkRefiner.message
    }),
    special: z.nativeEnum(SpecialCmsLink).optional(),
})

export const cmsLinkSchemas = {
    create: baseSchema.pick({
        name: true,
        text: true,
        url: true,
        special: true,
    }),
    update: baseSchema.pick({
        text: true,
        url: true,
    }).partial()
} as const
