'use server'
import { createArticle } from '@/server/cms/articles/create'
import { safeServerCall } from '@/actions/safeServerCall'
import { createZodActionError } from '@/actions/error'
import { createArticleSchema } from '@/server/cms/articles/schema'
import type { CreateArticleType } from '@/server/cms/articles/schema'
import type { ExpandedArticle } from '@/cms/articles/Types'
import type { ActionReturn } from '@/actions/Types'

export async function createArticleAction(
    rawData: FormData | CreateArticleType,
    categoryId?: number,
): Promise<ActionReturn<ExpandedArticle>> {
    //TODO: auth on permission or visibility to categoryId

    const parse = createArticleSchema.typeValidate(rawData)
    if (!parse.success) return createZodActionError(parse)
    const data = parse.data

    return await safeServerCall(() => createArticle(data, categoryId))
}
