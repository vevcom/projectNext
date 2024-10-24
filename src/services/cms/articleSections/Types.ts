import type { ExpandedCmsImage } from '@/cms/images/Types'
import type { ArticleSection, CmsParagraph, CmsLink } from '@prisma/client'
import { CmsLinkCollapsed } from '../links/Types'

export type ArticleSectionPart = 'cmsLink' | 'cmsParagraph' | 'cmsImage'

export type ExpandedArticleSection = ArticleSection & {
    cmsImage: ExpandedCmsImage | null,
    cmsParagraph: CmsParagraph | null,
    cmsLink: CmsLinkCollapsed | null,
}
