import type { cmsLinkOperations } from './operations'
import type { ActionFromSubServiceOperation } from '@/services/actionTypes'

export type UpdateCmsLinkAction = ActionFromSubServiceOperation<typeof cmsLinkOperations.update>
export type CreateCmsLinkAction = ActionFromSubServiceOperation<typeof cmsLinkOperations.create>

