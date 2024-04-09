import { baseCmsImageValidation } from '@/server/cms/images/validation'
import type { ValidationTypes } from '@/server/Validation'

export const createCmsImageActionValidation = baseCmsImageValidation.createValidation({
    keys: ['name'],
    transformer: data => data,
})
export type CreateCmsImageActionTypes = ValidationTypes<typeof createCmsImageActionValidation>
