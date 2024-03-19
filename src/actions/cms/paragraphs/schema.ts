import { createCmsParagraphSchema } from '@/server/cms/paragraphs/schema'
import type { ValidationType } from '@/server/Validation'

export const createCmsParagraphActionSchema = createCmsParagraphSchema.pick(['name'])

export type CreateCmsParagraphActionType = ValidationType<typeof createCmsParagraphActionSchema>
