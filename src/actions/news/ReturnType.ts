import type { ReturnType as AricleReturnType } from "@/cms/articles/ReturnType"
import type { NewsArticle } from "@prisma/client"

export type ReturnType = NewsArticle & {
    article: AricleReturnType
}