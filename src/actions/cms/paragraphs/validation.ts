import { baseCmsParagraphValidation } from '@/services/cms/paragraphs/validation'
import type { ValidationTypes } from '@/services/Validation'

export const createCmsParagraphActionValidation = baseCmsParagraphValidation.createValidation({
    keys: ['name'],
    transformer: data => data
})

export type CreateCmsParagraphActionTypes = ValidationTypes<typeof createCmsParagraphActionValidation>
