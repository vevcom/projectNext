import type { ExpandedCmsImage } from '@/cms/images/Types'
import type { ArticleSection, CmsParagraph } from '@prisma/client'
import type { CmsLinkCollapsed, CmsLinkExpanded } from '@/cms/links/Types'

export type ArticleSectionPart = 'cmsLink' | 'cmsParagraph' | 'cmsImage'

export type ExpandedArticleSection<CmsLinkIsCollapsed extends boolean> = ArticleSection & {
    cmsImage: ExpandedCmsImage | null,
    cmsParagraph: CmsParagraph | null,
    cmsLink: (CmsLinkIsCollapsed extends true ? CmsLinkCollapsed : CmsLinkExpanded) | null
}
