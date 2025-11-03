import type { cmsParagraphOperations } from './operations'
import type { ActionFromSubServiceOperation } from '@/services/actionTypes'

export type UpdateCmsParagraphAction = ActionFromSubServiceOperation<typeof cmsParagraphOperations.updateContent>
export type ReadSpecialCmsParagraphAction = ActionFromSubServiceOperation<typeof cmsParagraphOperations.readSpecial>
