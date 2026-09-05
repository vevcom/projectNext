import type { Article, ArticleCategory } from '@/prisma-generated-pn-types'
import type { ExpandedImage } from '@/services/images/subservice/types'

export type ExpandedArticleCategory = ArticleCategory & { articles: Article[] }

export type ExpandedArticleCategoryWithCover = ExpandedArticleCategory & { coverImage: ExpandedImage | null }

export type ArticleCategoryWithCover = ArticleCategory & { coverImage: ExpandedImage | null }
