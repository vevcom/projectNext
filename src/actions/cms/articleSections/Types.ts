import type { ArticleSection, CmsImage, CmsParagraph, CmsLink } from '@prisma/client'
import { ExpandedCmsImage } from '../images/Types'

export type ExpandedArticleSection = ArticleSection & {
    cmsImage: ExpandedCmsImage | null,
    cmsParagraph: CmsParagraph | null,
    cmsLink: CmsLink | null,
}
