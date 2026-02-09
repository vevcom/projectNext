import type { ExpandedCmsImage } from '@/cms/images/types'
import type { CmsParagraph, ScreenPage } from '@/prisma-generated-pn-types'


export type ExpandedScreenPage = ScreenPage & {
    cmsImage: ExpandedCmsImage
    cmsParagraph: CmsParagraph
}
