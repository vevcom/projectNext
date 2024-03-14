'use server'
import type { ExpandedArticleCategory } from '@/cms/articleCategories/Types'
import type { ActionReturn } from '@/actions/Types'
import { destroyArticleCategory } from '@/server/cms/articleCategories/destroy'

export async function destroyArticleCategoryAction(id: number): Promise<ActionReturn<ExpandedArticleCategory>> {
    // TODO: Cheek for visibility type edit of user.
    return await destroyArticleCategory(id)
}
