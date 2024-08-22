import { ValidationBase } from '@/server/Validation'
import { z } from 'zod'
import { ScreenPageType } from '@prisma/client'
import type { ValidationTypes } from '@/server/Validation'

const basePageValidation = new ValidationBase({
    type: {
        name: z.string(),
        type: z.nativeEnum(ScreenPageType),
        connectToJobAd: z.string()
    },
    details: {
        name: z.string(),
        type: z.nativeEnum(ScreenPageType),
        connectToJobAd: z.number()
    }
})

export const createPageValidation = basePageValidation.createValidation({
    keys: ['name'],
    transformer: data => data
})
export type CreatePageTypes = ValidationTypes<typeof createPageValidation>

export const updatePageValidation = basePageValidation.createValidation({
    keys: ['name', 'type', 'connectToJobAd'],
    transformer: data => ({ ...data, connectToJobAd: parseInt(data.connectToJobAd, 10) })
})
export type UpdatePageTypes = ValidationTypes<typeof updatePageValidation>
