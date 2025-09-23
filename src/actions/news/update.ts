'use server'
import { safeServerCall } from '@/actions/safeServerCall'
import { createZodActionError, createActionError } from '@/actions/error'
import { updateNews } from '@/services/news/update'
import { updateNewsArticleValidation } from '@/services/news/validation'
import { NotificationMethods } from '@/services/notifications/methods'
import { updateVisibilityPublished } from '@/services/visibility/update'
import { readNews } from '@/services/news/read'
import type { SimpleNewsArticle } from '@/services/news/Types'
import type { ActionReturn } from '@/actions/Types'
import type { UpdateNewsArticleTypes } from '@/services/news/validation'

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
    id: number,
    shouldPublish: boolean
): Promise<ActionReturn<Pick<SimpleNewsArticle, 'articleName'>>> {
    return await safeServerCall(async () => {
        // Get the news article to access its visibility
        const news = await readNews(id)
        
        // Update the visibility published status
        await updateVisibilityPublished(news.visibilityId, shouldPublish)
        
        // If publishing (not unpublishing), send notification
        if (shouldPublish) {
            NotificationMethods.createSpecial.newClient().execute({
                params: {
                    special: 'NEW_NEWS_ARTICLE',
                },
                data: {
                    title: 'Ny nyhetsartikkel',
                    message: `Ny nyhetsartikkel er publisert: ${news.articleName}`,
                },
                session: null,
                bypassAuth: true,
            })
        }
        
        return { articleName: news.articleName }
    })
}

export async function updateVisibilityAction(id: number, published: boolean): Promise<ActionReturn<{ published: boolean }>> {
    return await safeServerCall(async () => {
        // Get the news article to access its visibility
        const news = await readNews(id)
        
        // Update the visibility published status
        await updateVisibilityPublished(news.visibilityId, published)
        
        return { published }
    })
}
