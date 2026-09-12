import type { ActionFromSubServiceOperation } from '@/services/actionTypes'
import type { cmsImageOperations } from './operations'
import type { ExpandedImage } from '@/services/images/subservice/types'
import type { CmsImage } from '@/prisma-generated-pn-types'

export type ExpandedCmsImage = CmsImage & {
    image: ExpandedImage | null
}

export type UpdateCmsImageAction = ActionFromSubServiceOperation<typeof cmsImageOperations.update>
export type ReadSpecialCmsImageAction = ActionFromSubServiceOperation<typeof cmsImageOperations.readSpecial>
