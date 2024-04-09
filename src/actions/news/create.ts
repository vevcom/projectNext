'use server'
import { safeServerCall } from '@/actions/safeServerCall'
import { createZodActionError } from '@/actions/error'
import { createNews } from '@/server/news/create'
import { createNewsArticleValidation } from '@/server/news/validation'
import type { ActionReturn } from '@/actions/Types'
import type { ExpandedNewsArticle } from '@/server/news/Types'
import type { CreateNewsArticleTypes } from '@/server/news/validation'

export async function createNewsAction(
    rawdata: FormData | CreateNewsArticleTypes['Type']
): Promise<ActionReturn<ExpandedNewsArticle>> {
    //TODO: check for can create news permission
    const parse = createNewsArticleValidation.typeValidate(rawdata)
    if (!parse.success) return createZodActionError(parse)
    const data = parse.data

    return await safeServerCall(() => createNews(data))
}
