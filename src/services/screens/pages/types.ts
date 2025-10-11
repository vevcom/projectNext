import type { ExpandedCmsImage } from '@/cms/images/types'
import type { CmsParagraph, ScreenPage } from '@prisma/client'


export type ExpandedScreenPage = ScreenPage & {
    cmsImage: ExpandedCmsImage
    cmsParagraph: CmsParagraph
}
