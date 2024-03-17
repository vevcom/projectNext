'use server'
import { destroyArticle } from '@/server/cms/articles/destroy'
import type { ActionReturn } from '@/actions/Types'
import type { Article } from '@prisma/client'
import { safeServerCall } from '@/actions/safeServerCall'

export async function destroyArticleAction(id: number): Promise<ActionReturn<Article>> {
    //TODO: auth
    return await safeServerCall(() => destroyArticle(id))
}
