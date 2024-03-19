import type { ExpandedCmsImage } from '@/cms/images/Types'
import type { ArticleSection, CmsParagraph, CmsLink } from '@prisma/client'

export type ExpandedArticleSection = ArticleSection & {
    cmsImage: ExpandedCmsImage | null,
    cmsParagraph: CmsParagraph | null,
    cmsLink: CmsLink | null,
}
