import type { ExpandedCmsImage } from '@/cms/images/types'
import type { Flair } from '@/prisma-generated-pn-types'


export type FlairWithImage = Pick<Flair, 'id'> & {
    cmsImage: ExpandedCmsImage
}
