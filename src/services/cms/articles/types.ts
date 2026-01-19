import type { Prisma } from '@/prisma-generated-pn-types'
import type { articleRealtionsIncluder } from './constants'
import type { ActionFromSubServiceOperation } from '@/services/actionTypes'
import type { articleOperations } from './operations'

export type ExpandedArticle = Prisma.ArticleGetPayload<{
    include: typeof articleRealtionsIncluder
}>

export type UpdateArticleAction = ActionFromSubServiceOperation<typeof articleOperations.update>
export type AddSectionToArticleAction = ActionFromSubServiceOperation<typeof articleOperations.addSection>
export type ReorderArticleSectionsAction = ActionFromSubServiceOperation<typeof articleOperations.reorderSections>
