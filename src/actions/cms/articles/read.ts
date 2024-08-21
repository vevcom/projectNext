'use server'
import { readArticle } from '@/services/cms/articles/read'
import { safeServerCall } from '@/actions/safeServerCall'
import type { ExpandedArticle } from '@/cms/articles/Types'
import type { ActionReturn } from '@/actions/Types'

export async function readArticleAction(idOrName: number | {
    name: string,
    category: string
}): Promise<ActionReturn<ExpandedArticle>> {
    //TODO: auth
    return await safeServerCall(() => readArticle(idOrName))
}
