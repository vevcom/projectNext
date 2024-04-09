'use server'
import { createArticle } from '@/server/cms/articles/create'
import { safeServerCall } from '@/actions/safeServerCall'
import { createZodActionError } from '@/actions/error'
import { createArticleValidation } from '@/server/cms/articles/validation'
import type { CreateArticleTypes } from '@/server/cms/articles/validation'
import type { ExpandedArticle } from '@/cms/articles/Types'
import type { ActionReturn } from '@/actions/Types'

export async function createArticleAction(
    rawData: FormData | CreateArticleTypes['Type'],
    categoryId?: number,
): Promise<ActionReturn<ExpandedArticle>> {
    //TODO: auth on permission or visibility to categoryId

    const parse = createArticleValidation.typeValidate(rawData)
    if (!parse.success) return createZodActionError(parse)
    const data = parse.data

    return await safeServerCall(() => createArticle(data, categoryId))
}
