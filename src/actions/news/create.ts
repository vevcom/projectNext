'use server'
import { safeServerCall } from '@/actions/safeServerCall'
import { createZodActionError } from '@/actions/error'
import { createNews } from '@/services/news/create'
import { createNewsArticleValidation } from '@/services/news/validation'
import type { ActionReturn } from '@/actions/Types'
import type { ExpandedNewsArticle } from '@/services/news/Types'
import type { CreateNewsArticleTypes } from '@/services/news/validation'

export async function createNewsAction(
    rawdata: FormData | CreateNewsArticleTypes['Type']
): Promise<ActionReturn<ExpandedNewsArticle>> {
    //TODO: check for can create news permission
    const parse = createNewsArticleValidation.typeValidate(rawdata)
    if (!parse.success) return createZodActionError(parse)
    const data = parse.data

    return await safeServerCall(() => createNews(data))
}
