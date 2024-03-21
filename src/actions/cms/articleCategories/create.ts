'use server'
import { createZodActionError } from '@/actions/error'
import { createArticleCategory } from '@/server/cms/articleCategories/create'
import { safeServerCall } from '@/actions/safeServerCall'
import { createArticleCategorySchema } from '@/server/cms/articleCategories/validation'
import type { CreateArticleCategoryTypes } from '@/server/cms/articleCategories/validation'
import type { ActionReturn } from '@/actions/Types'
import type { ExpandedArticleCategory } from '@/cms/articleCategories/Types'

export async function createArticleCategoryAction(
    rawData: FormData | CreateArticleCategoryTypes['Type']
): Promise<ActionReturn<ExpandedArticleCategory>> {
    //TODO: check permission
    const parse = createArticleCategorySchema.typeValidate(rawData)
    if (!parse.success) return createZodActionError(parse)
    const data = parse.data

    return await safeServerCall(() => createArticleCategory(data))
}
