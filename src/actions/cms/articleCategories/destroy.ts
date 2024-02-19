'use server'

import prisma from '@/prisma'
import errorHandler from '@/prisma/errorHandler'
import type { ReturnType } from './ReturnType'
import type { ActionReturn } from '@/actions/type'
import { destroyArticle } from '../articles/destroy'

export async function destroyArticleCategory(id: number): Promise<ActionReturn<ReturnType>> {
    try {
        // TODO: Cheek for visibility type edit of user.
        // destroy all articles in articleCategory using destroyArticle function, to make sure all articleSections are destroyed
        // with relation to cmsLink, cmsParagraph and cmsImage
        const articles = await prisma.article.findMany({
            where: {
                articleCategoryId: id
            }
        })
        for (const article of articles) {
            const res = await destroyArticle(article.id)
            console.log(res)
            if (!res.success) return res
        }

        const articleCategory = await prisma.articleCategory.delete({
            where: {
                id
            },
            include: {
                articles: true
            }
        })
        return { success: true, data: articleCategory }
    } catch (error) {
        return errorHandler(error)
    }
}