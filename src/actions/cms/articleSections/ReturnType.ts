import type { ArticleSection, CmsImage, CmsParagraph, CmsLink } from "@prisma/client";

export type ReturnType = ArticleSection & {
    cmsImage: CmsImage,
    cmsParagraph: CmsParagraph,
    cmsLink: CmsLink
}