'use server'
import { safeServerCall } from '@/actions/safeServerCall'
import { createZodActionError } from '@/actions/error'
import { createNews } from '@/server/news/create'
import type { ActionReturn } from '@/actions/Types'
import type { ExpandedNewsArticle } from '@/server/news/Types'
import { createNewsArticleValidation } from '@/server/news/schema'
import type { CreateNewsArticleType } from '@/server/news/schema'

export async function createNewsAction(
    rawdata: FormData | CreateNewsArticleType
): Promise<ActionReturn<ExpandedNewsArticle>> {
    //TODO: check for can create news permission
    const parse = createNewsArticleValidation.typeValidate(rawdata)
    if (!parse.success) return createZodActionError(parse)
    const data = parse.data

    return await safeServerCall(() => createNews(data))
}
