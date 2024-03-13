'use server'
import type { ExpandedArticle } from '@/cms/articles/Types'
import type { ActionReturn } from '@/actions/Types'
import { readArticle } from '@/server/cms/articles/read'

export async function readArticleAction(idOrName: number | {
    name: string,
    category: string
}): Promise<ActionReturn<ExpandedArticle>> {
    //TODO: auth
    return await readArticle(idOrName)
}