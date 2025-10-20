import type { ExpandedCmsImage } from '@/cms/images/types'
import type { ArticleSection, CmsParagraph, CmsLink } from '@prisma/client'
import type { baseSchema } from './schemas'
import type { z } from 'zod'
import type { ActionFromSubServiceOperation } from '@/services/actionTypes'
import type { articleSectionOperations } from './operations'

export type ArticleSectionPart = z.input<typeof baseSchema>['part']

export type ExpandedArticleSection = ArticleSection & {
    cmsImage: ExpandedCmsImage | null,
    cmsParagraph: CmsParagraph | null,
    cmsLink: CmsLink | null,
}

export type UpdateArticleSectionAction = ActionFromSubServiceOperation<typeof articleSectionOperations.update>
export type AddPartToArticleSectionAction = ActionFromSubServiceOperation<typeof articleSectionOperations.addPart>
export type RemovePartFromArticleSectionAction = ActionFromSubServiceOperation<typeof articleSectionOperations.removePart>
