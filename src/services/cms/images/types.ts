import type { ActionFromSubServiceOperation } from '@/services/actionTypes'
import type { cmsImageOperations } from './operations'
import type { Image, CmsImage } from '@/prisma-generated-pn-types'

export type ExpandedCmsImage = CmsImage & {
    image: Image | null
}

export type UpdateCmsImageAction = ActionFromSubServiceOperation<typeof cmsImageOperations.update>
export type ReadSpecialCmsImageAction = ActionFromSubServiceOperation<typeof cmsImageOperations.readSpecial>
