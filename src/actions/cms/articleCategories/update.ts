'use server'
import { createZodActionError } from '@/actions/error'
import { updateArticleCategory } from '@/server/cms/articleCategories/update'
import { safeServerCall } from '@/actions/safeServerCall'
import { updateArticleCategoryValidation } from '@/server/cms/articleCategories/validation'
import type { UpdateArticleCategoryTypes } from '@/server/cms/articleCategories/validation'
import type { ActionReturn } from '@/actions/Types'
import type { ExpandedArticleCategory } from '@/cms/articleCategories/Types'

export async function updateArticleCategoryVisibilityAction(
    // disable eslint rule temporarily until function is implemented
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    id: number,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    visibility: unknown
): Promise<ActionReturn<ExpandedArticleCategory>> {
    throw new Error('Not implemented')
}

export async function updateArticleCategoryAction(
    id: number,
    rawData: FormData | UpdateArticleCategoryTypes['Type']
): Promise<ActionReturn<ExpandedArticleCategory>> {
    const parse = updateArticleCategoryValidation.typeValidate(rawData)
    if (!parse.success) return createZodActionError(parse)
    const data = parse.data

    return await safeServerCall(() => updateArticleCategory(id, data))
}
