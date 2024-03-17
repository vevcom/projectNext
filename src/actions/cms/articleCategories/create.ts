'use server'
import { articleCategorySchema } from './schema'
import { createZodActionError } from '@/actions/error'
import { createArticleCategory } from '@/server/cms/articleCategories/create'
import type { ArticleCategorySchemaType } from './schema'
import type { ActionReturn } from '@/actions/Types'
import type { ExpandedArticleCategory } from '@/cms/articleCategories/Types'
import { safeServerCall } from '@/actions/safeServerCall'

export async function createArticleCategoryAction(
    rawData: FormData | ArticleCategorySchemaType
): Promise<ActionReturn<ExpandedArticleCategory>> {
    //TODO: check permission
    const parse = articleCategorySchema.safeParse(rawData)
    if (!parse.success) return createZodActionError(parse)
    const data = parse.data

    return await safeServerCall(() => createArticleCategory(data))
}
