'use server'
import type { ExpandedArticleCategory } from './types'
import type { ActionReturn } from '@/services/actionTypes'
import { makeAction } from '@/services/serverAction'
import { articleCategoryOperations } from './operations'

export const createArticleCategoryAction = makeAction(articleCategoryOperations.create)
export const destroyArticleCategoryAction = makeAction(articleCategoryOperations.destroy)
export const readArticleCategoriesAction = makeAction(articleCategoryOperations.readAll)
export const readArticleCategoryAction = makeAction(articleCategoryOperations.read)
export const readArticleInCategoryAction = makeAction(articleCategoryOperations.readArticleInCategory)
export const updateArticleCategoryAction = makeAction(articleCategoryOperations.update)
export const addArticleToCategoryAction = makeAction(articleCategoryOperations.addArticleToCategory)
export const removeArticleFromCategoryAction = makeAction(articleCategoryOperations.removeArticleFromCategory)

export const updateArticleCategoryArticleAction = makeAction(articleCategoryOperations.updateArticle.update)
export const updateArticleCategoryArticleAddSectionAction = makeAction(articleCategoryOperations.updateArticle.addSection)
export const updateArticleCategoryArticleReorderSectionsAction = makeAction(articleCategoryOperations.updateArticle.reorderSections)
export const updateArticleCategoryArticleCoverImageAction = makeAction(articleCategoryOperations.updateArticle.coverImage)
export const updateArticleCategoryArticleSectionAction = makeAction(articleCategoryOperations.updateArticle.articleSections.update)
export const updateArticleCategoryArticleSectionsAddPartAction = makeAction(articleCategoryOperations.updateArticle.articleSections.addPart)
export const updateArticleCategoryArticleSectionsRemovePartAction = makeAction(articleCategoryOperations.updateArticle.articleSections.removePart)
export const updateArticleCategoryArticleCmsImageAction = makeAction(articleCategoryOperations.updateArticle.articleSections.cmsImage)
export const updateArticleCategoryArticleCmsParagraphAction = makeAction(articleCategoryOperations.updateArticle.articleSections.cmsParagraph)
export const updateArticleCategoryArticleCmsLinkAction = makeAction(articleCategoryOperations.updateArticle.articleSections.cmsLink)

//TODO: Implement vicibility system as part of articleCategoryOperations
export async function updateArticleCategoryVisibilityAction(
    // disable eslint rule temporarily until function is implemented
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    id: number,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    visibility: unknown
): Promise<ActionReturn<ExpandedArticleCategory>> {
    throw new Error('Not implemented')
}