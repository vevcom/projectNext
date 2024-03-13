'use server'
import type { ExpandedArticle } from '@/cms/articles/Types'
import type { ActionReturn } from '@/actions/Types'
import { createArticle } from '@/server/cms/articles/create'

export async function createArticleAction(name: string | null, config?: {
    categoryId: number,
}): Promise<ActionReturn<ExpandedArticle>> {
    //TODO: auth on permission or visibility to categoryId
    return await createArticle(name, config)
}
