import { baseCmsImageValidation } from '@/services/cms/images/validation'
import type { ValidationTypes } from '@/services/Validation'

export const createCmsImageActionValidation = baseCmsImageValidation.createValidation({
    keys: ['name'],
    transformer: data => data,
})
export type CreateCmsImageActionTypes = ValidationTypes<typeof createCmsImageActionValidation>
