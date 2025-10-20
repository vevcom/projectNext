import type { articleSectionsRealtionsIncluder } from './constants'
import type { baseSchema } from './schemas'
import type { z } from 'zod'
import type { ActionFromSubServiceOperation } from '@/services/actionTypes'
import type { articleSectionOperations } from './operations'
import type { Prisma } from '@prisma/client'

export type ArticleSectionPart = z.input<typeof baseSchema>['part']

export type ExpandedArticleSection = Prisma.ArticleSectionGetPayload<{
    include: typeof articleSectionsRealtionsIncluder
}>

export type UpdateArticleSectionAction = ActionFromSubServiceOperation<typeof articleSectionOperations.update>
export type AddPartToArticleSectionAction = ActionFromSubServiceOperation<typeof articleSectionOperations.addPart>
export type RemovePartFromArticleSectionAction = ActionFromSubServiceOperation<typeof articleSectionOperations.removePart>
