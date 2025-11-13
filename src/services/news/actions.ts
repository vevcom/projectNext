'use server'
import { newsOperations } from './operations'
import { createActionError } from '@/services/actionError'
import { notificationOperations } from '@/services/notifications/operations'
import { makeAction } from '@/services/serverAction'
import type { SimpleNewsArticle } from '@/services/news/types'
import type { ActionReturn } from '@/services/actionTypes'

export const createNewsAction = makeAction(newsOperations.create)
export const destroyNewsAction = makeAction(newsOperations.destroy)
export const readOldNewsPageAction = makeAction(newsOperations.readOldPage)
export const readNewsCurrentAction = makeAction(newsOperations.readCurrent)
export const readNewsAction = makeAction(newsOperations.read)
export const updateNewsAction = makeAction(newsOperations.update)

export const updateNewsArticleAction = makeAction(
    newsOperations.updateArticle.update
)
export const updateNewsArticleAddSectionAction = makeAction(
    newsOperations.updateArticle.addSection
)
export const updateNewsArticleReorderSectionsAction = makeAction(
    newsOperations.updateArticle.reorderSections
)
export const updateNewsArticleCoverImageAction = makeAction(
    newsOperations.updateArticle.coverImage
)
export const updateNewsArticleSectionAction = makeAction(
    newsOperations.updateArticle.articleSections.update
)
export const updateNewsArticleSectionsAddPartAction = makeAction(
    newsOperations.updateArticle.articleSections.addPart
)
export const updateNewsArticleSectionsRemovePartAction = makeAction(
    newsOperations.updateArticle.articleSections.removePart
)
export const updateNewsArticleCmsImageAction = makeAction(
    newsOperations.updateArticle.articleSections.cmsImage
)
export const updateNewsArticleCmsParagraphAction = makeAction(
    newsOperations.updateArticle.articleSections.cmsParagraph
)
export const updateNewsArticleCmsLinkAction = makeAction(
    newsOperations.updateArticle.articleSections.cmsLink
)

export async function publishNewsAction(
    // disable eslint rule temporarily until todo is resolved
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    id: number,
    // disable eslint rule temporarily until todo is resolved
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    shouldPublish: boolean
): Promise<ActionReturn<Omit<SimpleNewsArticle, 'coverImage'>>> {
    notificationOperations.createSpecial({
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
