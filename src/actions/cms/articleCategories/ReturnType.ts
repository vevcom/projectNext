import type { Article, ArticleCategory, Image } from '@prisma/client'

export type ReturnType = ArticleCategory & {
    articles: Article[]
}