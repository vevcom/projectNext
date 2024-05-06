'use server'
import { safeServerCall } from '@/actions/safeServerCall'
import { createActionError, createZodActionError } from '@/actions/error'
import { updateNews } from '@/server/news/update'
import { updateNewsArticleValidation } from '@/server/news/validation'
import { dispatchSpecialNotification } from '@/server/notifications/create'
import type { SimpleNewsArticle } from '@/server/news/Types'
import type { ActionReturn } from '@/actions/Types'
import type { UpdateNewsArticleTypes } from '@/server/news/validation'

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
    dispatchSpecialNotification('NEW_NEWS_ARTICLE', 'Nyhet🗞️: <En tittel her kanskje?>', 'Starten av artikkelen her kanskje?')

    return createActionError('UNKNOWN ERROR', 'Not implemented')
}

// disable eslint rule temporarily until todo is resolved
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function updateVisibilityAction(id: number, visible: unknown): Promise<ActionReturn<unknown>> {
    //TODO: add visible field to news
    return createActionError('UNKNOWN ERROR', 'Not implemented')
}
