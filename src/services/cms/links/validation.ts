import { ValidationBase } from '@/services/Validation'
import { z } from 'zod'
import type { ValidationTypes } from '@/services/Validation'

export const baseCmsLinkValidation = new ValidationBase({
    type: {
        name: z.string(),
        text: z.string(),
        url: z.string(),
    },
    details: {
        name: z.string(),
        text: z.string().min(1, 'Linken må ha tekst på mer enn 1 bokstav').max(30, 'Max lengde er 30'),
        url: z.string()
    }
})

const cmsLinkRefiner = {
    fcn: ({ url }: { url?: string }): boolean => {
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

export const createCmsLinkValidation = baseCmsLinkValidation.createValidationPartial({
    keys: ['name', 'text', 'url'],
    transformer: data => data,
    refiner: cmsLinkRefiner
})

export type CreateCmsLinkTypes = ValidationTypes<typeof createCmsLinkValidation>

export const updateCmsLinkValidation = baseCmsLinkValidation.createValidationPartial({
    keys: ['text', 'url'],
    transformer: data => data,
    refiner: cmsLinkRefiner
})

export type UpdateCmsLinkTypes = ValidationTypes<typeof updateCmsLinkValidation>
