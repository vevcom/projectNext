'use server'
import type { ActionReturn } from '@/actions/Types'
import type { SimpleNewsArticle } from '@/server/news/Types'
import { destroyNews } from '@/server/news/destroy'

export async function destroyNewsAction(id: number): Promise<ActionReturn<Omit<SimpleNewsArticle, 'coverImage'>>> {
    //TODO: check auth
    return await destroyNews(id)
}
