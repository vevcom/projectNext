import { Validation } from '@/server/Validation'
import { z } from 'zod'
import type { ValidationType } from '@/server/Validation'

export const baseCmsLinkSchema = new Validation({
    name: z.string(),
    text: z.string(),
    url: z.string(),
}, {
    name: z.string(),
    text: z.string().min(1, 'Linken må ha tekst på mer enn 1 bokstav').max(30, 'Max lengde er 30'),
    url: z.string()
})

const cmsLinkRefiner = ({ url }: { url: string }): boolean => {
    try {
        const urlObject = new URL(url)
        return Boolean(urlObject)
    } catch (_) {
        return url.startsWith('/') || url.includes('.')
    }
}

const cmsLinkRefinerMessage = 'Ugyldig URL.'

export const createCmsLinkSchema = baseCmsLinkSchema.setRefiner(cmsLinkRefiner, cmsLinkRefinerMessage)

export type CreateCmsLinkType = ValidationType<typeof createCmsLinkSchema>

export const updateCmsLinkSchema = baseCmsLinkSchema
    .pick(['text', 'url'])
    .partialize()
    .setRefiner(cmsLinkRefiner, cmsLinkRefinerMessage)

export type UpdateCmsLinkType = ValidationType<typeof updateCmsLinkSchema>
