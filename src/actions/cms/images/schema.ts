import { createCmsImageSchema } from '@/server/cms/images/schema'
import type { ValidationType } from '@/server/Validation'

export const createCmsImageActionSchema = createCmsImageSchema.pick(['name'])

export type CreateCmsImageActionType = ValidationType<typeof createCmsImageActionSchema>
