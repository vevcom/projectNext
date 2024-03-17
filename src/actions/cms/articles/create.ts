'use server'
import { createArticle } from '@/server/cms/articles/create'
import { safeServerCall } from '@/actions/safeServerCall'
import type { ExpandedArticle } from '@/cms/articles/Types'
import type { ActionReturn } from '@/actions/Types'

export async function createArticleAction(name: string | null, config?: {
    categoryId: number,
}): Promise<ActionReturn<ExpandedArticle>> {
    //TODO: auth on permission or visibility to categoryId
    return await safeServerCall(() => createArticle(name, config))
}
