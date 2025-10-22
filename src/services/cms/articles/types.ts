import type { Prisma } from '@prisma/client'
import type { articleRealtionsIncluder } from './constants'
import type { ActionFromSubServiceOperation } from '@/services/actionTypes'
import type { articleOperations } from './operations'

export type ExpandedArticle = Prisma.ArticleGetPayload<{
    include: typeof articleRealtionsIncluder
}>

export type UpdateArticleAction = ActionFromSubServiceOperation<typeof articleOperations.update>
export type AddSectionToArticleAction = ActionFromSubServiceOperation<typeof articleOperations.addSection>
export type ReorderSectionsAction = ActionFromSubServiceOperation<typeof articleOperations.reorderSections>
