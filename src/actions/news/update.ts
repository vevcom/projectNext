'use server'
import { safeServerCall } from '@/actions/safeServerCall'
import { createZodActionError } from '@/actions/error'
import { updateNews } from '@/server/news/update'
import { updateNewsArticleValidation } from '@/server/news/validation'
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
