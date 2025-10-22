import type { Prisma } from '@prisma/client'
import type { articleRealtionsIncluder } from './constants'

export type ExpandedArticle = Prisma.ArticleGetPayload<{
    include: typeof articleRealtionsIncluder
}>

