'use server'
import { createArticle } from '@/server/cms/articles/create'
import { safeServerCall } from '@/actions/safeServerCall'
import { createArticleCategorySchema } from '@/server/cms/articleCategories/schema'
import { createZodActionError } from '@/actions/error'
import type { CreateArticleCategoryType } from '@/server/cms/articleCategories/schema'
import type { ExpandedArticle } from '@/cms/articles/Types'
import type { ActionReturn } from '@/actions/Types'

export async function createArticleAction(
    rawData: FormData | CreateArticleCategoryType,
    categoryId?: number,
): Promise<ActionReturn<ExpandedArticle>> {
    //TODO: auth on permission or visibility to categoryId

    const parse = createArticleCategorySchema.typeValidate(rawData)
    if (!parse.success) return createZodActionError(parse)
    const data = parse.data

    return await safeServerCall(() => createArticle(data, categoryId))
}
