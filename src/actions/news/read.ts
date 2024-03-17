'use server'
import { readNews, readNewsCurrent, readOldNewsPage } from '@/server/news/read'
import type { ExpandedNewsArticle, SimpleNewsArticle } from '@/server/news/Types'
import type { ActionReturn, ReadPageInput } from '@/actions/Types'
import { safeServerCall } from '../safeServerCall'

export async function readOldNewsPageAction<const PageSize extends number>(
    readPageImput: ReadPageInput<PageSize>
): Promise<ActionReturn<SimpleNewsArticle[]>> {
    //TODO: only read news with right visibility
    return await safeServerCall(() => readOldNewsPage(readPageImput))
}

export async function readNewsCurrentAction(): Promise<ActionReturn<SimpleNewsArticle[]>> {
    //TODO: only read news with right visibility
    return await safeServerCall(() => readNewsCurrent())
}

export async function readNewsAction(idOrName: number | {
    articleName: string
    order: number
}): Promise<ActionReturn<ExpandedNewsArticle>> {
    //TODO: only read news if right visibility
    return await safeServerCall(() => readNews(idOrName))
}
