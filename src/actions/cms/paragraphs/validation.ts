import { baseCmsParagraphValidation } from '@/server/cms/paragraphs/validation'
import type { ValidationTypes } from '@/server/Validation'

export const createCmsParagraphActionValidation = baseCmsParagraphValidation.createValidation({
    keys: ['name'],
    transformer: data => data
})

export type CreateCmsParagraphActionTypes = ValidationTypes<typeof createCmsParagraphActionValidation>
