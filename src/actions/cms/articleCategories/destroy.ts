'use server'
import { destroyArticleCategory } from '@/services/cms/articleCategories/destroy'
import { safeServerCall } from '@/actions/safeServerCall'
import type { ExpandedArticleCategory } from '@/cms/articleCategories/Types'
import type { ActionReturn } from '@/actions/Types'

export async function destroyArticleCategoryAction(id: number): Promise<ActionReturn<ExpandedArticleCategory>> {
    // TODO: Cheek for visibility type edit of user.
    return await safeServerCall(() => destroyArticleCategory(id))
}
