'use server'
import { safeServerCall } from '@/actions/safeServerCall'
import { destroyNews } from '@/services/news/destroy'
import type { ActionReturn } from '@/actions/Types'
import type { SimpleNewsArticle } from '@/services/news/Types'

export async function destroyNewsAction(id: number): Promise<ActionReturn<Omit<SimpleNewsArticle, 'coverImage'>>> {
    //TODO: check auth
    return await safeServerCall(() => destroyNews(id))
}
