'use server'

import { createZodActionError } from '@/actions/error'
import { safeServerCall } from '@/actions/safeServerCall'
import type { ActionReturn } from '@/actions/Types'
import type { ArticleCategoryWithCover, 
    ExpandedArticleCategoryWithCover, ExpandedArticleCategory } from '@/cms/articleCategories/Types'
import { createArticleCategory } from '@/services/cms/articleCategories/create'
import { destroyArticleCategory } from '@/services/cms/articleCategories/destroy'
import { readArticleCategories, readArticleCategory } from '@/services/cms/articleCategories/read'
import { updateArticleCategory } from '@/services/cms/articleCategories/update'
import { createArticleCategoryValidation, updateArticleCategoryValidation } from '@/services/cms/articleCategories/validation'
import type { CreateArticleCategoryTypes, UpdateArticleCategoryTypes } from '@/services/cms/articleCategories/validation'

export async function createArticleCategoryAction(
    rawData: FormData | CreateArticleCategoryTypes['Type']
): Promise<ActionReturn<ExpandedArticleCategory>> {
    //TODO: check permission
    const parse = createArticleCategoryValidation.typeValidate(rawData)
    if (!parse.success) return createZodActionError(parse)
    const data = parse.data

    return await safeServerCall(() => createArticleCategory(data))
}

export async function destroyArticleCategoryAction(id: number): Promise<ActionReturn<ExpandedArticleCategory>> {
    // TODO: Cheek for visibility type edit of user.
    return await safeServerCall(() => destroyArticleCategory(id))
}

export async function readArticleCategoriesAction(): Promise<ActionReturn<ArticleCategoryWithCover[]>> {
    //TODO: only read categories that user has visibility
    return await safeServerCall(() => readArticleCategories())
}

export async function readArticleCategoryAction(name: string): Promise<ActionReturn<ExpandedArticleCategoryWithCover>> {
    //TODO: only read if right visibility
    return await safeServerCall(() => readArticleCategory(name))
}

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
