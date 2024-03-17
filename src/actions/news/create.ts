'use server'
import { newsArticleSchema } from './schema'
import { safeServerCall } from '@/actions/safeServerCall'
import { createZodActionError } from '@/actions/error'
import { createNews } from '@/server/news/create'
import type { ActionReturn } from '@/actions/Types'
import type { ExpandedNewsArticle } from '@/server/news/Types'
import type { NewsArticleSchemaType } from './schema'

export async function createNewsAction(
    rawdata: FormData | NewsArticleSchemaType
): Promise<ActionReturn<ExpandedNewsArticle>> {
    //TODO: check for can create news permission
    const parse = newsArticleSchema.safeParse(rawdata)
    if (!parse.success) return createZodActionError(parse)
    const data = parse.data

    return await safeServerCall(() => createNews(data))
}
