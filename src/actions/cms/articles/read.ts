'use server'
import { readArticle } from '@/server/cms/articles/read'
import type { ExpandedArticle } from '@/cms/articles/Types'
import type { ActionReturn } from '@/actions/Types'
import { safeServerCall } from '@/actions/safeServerCall'

export async function readArticleAction(idOrName: number | {
    name: string,
    category: string
}): Promise<ActionReturn<ExpandedArticle>> {
    //TODO: auth
    return await safeServerCall(() => readArticle(idOrName))
}
