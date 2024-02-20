import { destroyArticleSection } from '@/cms/articleSections/destroy'
import prisma from '@/prisma'
import errorHandler from '@/prisma/errorHandler'
import type { ActionReturn } from '@/actions/type'
import type { Article } from '@prisma/client'

export async function destroyArticle(id: number): Promise<ActionReturn<Article>> {
    try {

        const article = await prisma.article.delete({
            where: { id }
        })

        return {
            success: true,
            data: article
        }
    } catch (error) {
        return errorHandler(error)
    }
}
