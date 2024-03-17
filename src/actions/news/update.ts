'use server'
import { newsArticleSchema } from './schema'
import { createActionError, createZodActionError } from '@/actions/error'
import { updateNews } from '@/server/news/update'
import type { SimpleNewsArticle } from '@/server/news/Types'
import type { ActionReturn } from '@/actions/Types'
import type { NewsArticleSchemaType } from './schema'
import { safeServerCall } from '../safeServerCall'


export async function updateNewsAction(
    id: number,
    rawdata: FormData | NewsArticleSchemaType
): Promise<ActionReturn<Omit<SimpleNewsArticle, 'coverImage'>>> {
    //TODO: auth
    const parse = newsArticleSchema.safeParse(rawdata)
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
    return createActionError('UNKNOWN ERROR', 'Not implemented')
}


// disable eslint rule temporarily until todo is resolved
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function updateVisibilityAction(id: number, visible: unknown): Promise<ActionReturn<unknown>> {
    //TODO: add visible field to news
    return createActionError('UNKNOWN ERROR', 'Not implemented')
}
