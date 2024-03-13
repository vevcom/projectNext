'use server'
import { destroyArticle } from '@/server/cms/articles/destroy'
import type { ActionReturn } from '@/actions/Types'
import type { Article } from '@prisma/client'

export async function destroyArticleAction(id: number): Promise<ActionReturn<Article>> {
    //TODO: auth
    return await destroyArticle(id)
}
