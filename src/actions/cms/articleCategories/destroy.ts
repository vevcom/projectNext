'use server'
import { destroyArticleCategory } from '@/server/cms/articleCategories/destroy'
import type { ExpandedArticleCategory } from '@/cms/articleCategories/Types'
import type { ActionReturn } from '@/actions/Types'
import { safeServerCall } from '@/actions/safeServerCall'

export async function destroyArticleCategoryAction(id: number): Promise<ActionReturn<ExpandedArticleCategory>> {
    // TODO: Cheek for visibility type edit of user.
    return await safeServerCall(() => destroyArticleCategory(id))
}
