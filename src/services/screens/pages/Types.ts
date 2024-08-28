import type { ExpandedCmsImage } from '@/services/cms/images/Types'
import type { CmsParagraph, ScreenPage } from '@prisma/client'


export type ExpandedScreenPage = ScreenPage & {
    cmsImage: ExpandedCmsImage
    cmsParagraph: CmsParagraph
}
