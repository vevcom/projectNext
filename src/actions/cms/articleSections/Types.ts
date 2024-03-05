import type { ArticleSection, CmsImage, CmsParagraph, CmsLink } from '@prisma/client'

export type ExpandedArticleSection = ArticleSection & {
    cmsImage: CmsImage | null,
    cmsParagraph: CmsParagraph | null,
    cmsLink: CmsLink | null,
}
