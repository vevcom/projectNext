import { ValidationBase } from '@/services/Validation'
import { z } from 'zod'
import { CmsLinkType } from '@prisma/client'
import type { ValidationTypes } from '@/services/Validation'

export const baseCmsLinkValidation = new ValidationBase({
    type: {
        name: z.string().optional(),
        type: z.nativeEnum(CmsLinkType),

        rawUrl: z.string().optional(),
        rawUrlText: z.string().optional(),

        newsArticleId: z.number().optional(),

        articleCategoryArticleId: z.number().optional(),

        imageCollectionId: z.number().optional(),
    },
    details: {
        name: z.string().optional(),
        type: z.nativeEnum(CmsLinkType),

        rawUrl: z.string().optional(),
        rawUrlText: z.string().min(
            1, 'Linken må ha tekst på mer enn 1 bokstav'
        ).max(
            30, 'Max lengde er 30'
        ).optional(),

        newsArticleId: z.number().optional(),

        articleCategoryArticleId: z.number().optional(),

        imageCollectionId: z.number().optional(),
    }
})

const cmsLinkRefiner = {
    fcn: ({ rawUrl }: { rawUrl?: string }): boolean => {
        if (!rawUrl) return true
        try {
            const urlObject = new URL(rawUrl)
            return Boolean(urlObject)
        } catch {
            return rawUrl.startsWith('/') || rawUrl.includes('.')
        }
    },
    message: 'Ugyldig URL.'
}

export const createCmsLinkValidation = baseCmsLinkValidation.createValidation({
    keys: ['name', 'type', 'rawUrl', 'rawUrlText', 'newsArticleId', 'articleCategoryArticleId', 'imageCollectionId'],
    transformer: data => data,
    refiner: cmsLinkRefiner
})

export type CreateCmsLinkTypes = ValidationTypes<typeof createCmsLinkValidation>

export const updateCmsLinkValidation = baseCmsLinkValidation.createValidationPartial({
    keys: ['name', 'type', 'rawUrl', 'rawUrlText', 'newsArticleId', 'articleCategoryArticleId', 'imageCollectionId'],
    transformer: data => data,
    refiner: cmsLinkRefiner
})

export type UpdateCmsLinkTypes = ValidationTypes<typeof updateCmsLinkValidation>
