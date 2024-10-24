'use server'
import { createArticle } from '@/services/cms/articles/create'
import { safeServerCall } from '@/actions/safeServerCall'
import { createZodActionError } from '@/actions/error'
import { createArticleValidation } from '@/services/cms/articles/validation'
import type { CreateArticleTypes } from '@/services/cms/articles/validation'
import type { ActionReturn } from '@/actions/Types'
import type { Article } from '@prisma/client'

export async function createArticleAction(
    rawData: FormData | CreateArticleTypes['Type'],
    categoryId?: number,
): Promise<ActionReturn<Article>> {
    //TODO: auth on permission or visibility to categoryId
    //TODO: This sction should be in the article category service. We should nort expose a way
    // to create loose articles!

    const parse = createArticleValidation.typeValidate(rawData)
    if (!parse.success) return createZodActionError(parse)
    const data = parse.data

    return await safeServerCall(() => createArticle(data, categoryId))
}
