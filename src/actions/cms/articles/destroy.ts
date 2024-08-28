'use server'
import { destroyArticle } from '@/services/cms/articles/destroy'
import { safeServerCall } from '@/actions/safeServerCall'
import type { ActionReturn } from '@/actions/Types'
import type { Article } from '@prisma/client'

export async function destroyArticleAction(id: number): Promise<ActionReturn<Article>> {
    //TODO: auth
    return await safeServerCall(() => destroyArticle(id))
}
