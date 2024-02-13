import type { Article, ArticleCategory, Image } from '@prisma/client'

export type ReturnType = ArticleCategory & {
    coverImage: Image | null //uses image of first article as cover image for category
    articles: Article[]
}