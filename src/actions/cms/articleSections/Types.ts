import type { ExpandedCmsImage } from '../images/Types'
import type { ArticleSection, CmsImage, CmsParagraph, CmsLink } from '@prisma/client'

export type ExpandedArticleSection = ArticleSection & {
    cmsImage: ExpandedCmsImage | null,
    cmsParagraph: CmsParagraph | null,
    cmsLink: CmsLink | null,
}
