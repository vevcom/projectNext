import type { Article, ArticleCategory, Image } from '@/prisma-generated-pn-types'

export type ExpandedArticleCategory = ArticleCategory & { articles: Article[] }

export type ExpandedArticleCategoryWithCover = ExpandedArticleCategory & { coverImage: Image | null }

export type ArticleCategoryWithCover = ArticleCategory & { coverImage: Image | null }
