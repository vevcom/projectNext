import type { Article, ArticleCategory } from '@prisma/client'

export type ReturnType = ArticleCategory & {
    articles: Article[]
}