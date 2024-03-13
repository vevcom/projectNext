'use server'
import prisma from '@/prisma'
import type { ExpandedArticle } from '@/cms/articles/Types'
import type { ActionReturn } from '@/actions/Types'
import { readArticle, readArticles } from '@/server/cms/articles/read'

export async function readArticleAction(idOrName: number | {
    name: string,
    category: string
}): Promise<ActionReturn<ExpandedArticle>> {
    //TODO: auth
    return await readArticle(idOrName)
}

/**
 * A action that reads all articles in a category
 * @param articleCategoryId - The id of the category to read articles from
 * @returns 
 */
export async function readArticlesAction(articleCategoryId: number): Promise<ActionReturn<ExpandedArticle[]>> {
    return await readArticles(articleCategoryId)
}
