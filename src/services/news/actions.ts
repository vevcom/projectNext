'use server'

import { createActionError, createZodActionError } from '@/actions/error'
import { safeServerCall } from '@/actions/safeServerCall'
import type { ActionReturn } from '@/actions/Types'
import type { ReadPageInput } from '@/lib/paging/Types'
import { createNews } from '@/services/news/create'
import { destroyNews } from '@/services/news/destroy'
import { readNews, readNewsCurrent, readOldNewsPage } from '@/services/news/read'
import type { ExpandedNewsArticle, NewsCursor, SimpleNewsArticle } from '@/services/news/Types'
import { updateNews } from '@/services/news/update'
import { createNewsArticleValidation, updateNewsArticleValidation } from '@/services/news/validation'
import type { CreateNewsArticleTypes, UpdateNewsArticleTypes } from '@/services/news/validation'
import { NotificationMethods } from '@/services/notifications/methods'

export async function createNewsAction(
    rawdata: FormData | CreateNewsArticleTypes['Type']
): Promise<ActionReturn<ExpandedNewsArticle>> {
    //TODO: check for can create news permission
    const parse = createNewsArticleValidation.typeValidate(rawdata)
    if (!parse.success) return createZodActionError(parse)
    const data = parse.data

    return await safeServerCall(() => createNews(data))
}

export async function destroyNewsAction(id: number): Promise<ActionReturn<Omit<SimpleNewsArticle, 'coverImage'>>> {
    //TODO: check auth
    return await safeServerCall(() => destroyNews(id))
}

export async function readOldNewsPageAction<const PageSize extends number>(
    readPageImput: ReadPageInput<PageSize, NewsCursor>
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

export async function updateNewsAction(
    id: number,
    rawdata: FormData | UpdateNewsArticleTypes['Type']
): Promise<ActionReturn<Omit<SimpleNewsArticle, 'coverImage'>>> {
    //TODO: auth
    const parse = updateNewsArticleValidation.typeValidate(rawdata)
    if (!parse.success) return createZodActionError(parse)
    const data = parse.data
    return await safeServerCall(() => updateNews(id, data))
}

export async function publishNewsAction(
    // disable eslint rule temporarily until todo is resolved
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    id: number,
    // disable eslint rule temporarily until todo is resolved
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    shouldPublish: boolean
): Promise<ActionReturn<Omit<SimpleNewsArticle, 'coverImage'>>> {
    NotificationMethods.createSpecial({
        params: {
            special: 'NEW_NEWS_ARTICLE',
        },
        data: {
            title: 'Ny nyhetsartikkel', // TODO: Add info about the article
            message: 'En ny nyhetsartikkel er publisert',
        },
        bypassAuth: true,
    })

    return createActionError('UNKNOWN ERROR', 'Not implemented')
}

// disable eslint rule temporarily until todo is resolved
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function updateVisibilityAction(id: number, visible: unknown): Promise<ActionReturn<unknown>> {
    //TODO: add visible field to news
    return createActionError('UNKNOWN ERROR', 'Not implemented')
}
