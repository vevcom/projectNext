import type { ReturnType as AricleReturnType } from '@/cms/articles/ReturnType'
import type { NewsArticle, Image } from '@prisma/client'

export type ReturnType = NewsArticle & {
    article: AricleReturnType
}

//used for read many actions
export type SimpleReturnType = NewsArticle & {
    coverImage: Image | null
}
