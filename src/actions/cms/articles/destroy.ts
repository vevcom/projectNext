import prisma from '@/prisma'
import errorHandler from '@/prisma/errorHandler'
import type { Article } from '@prisma/client'
import { ActionReturn } from '@/actions/type'
import { destroyArticleSection } from '../articleSections/destroy'

export async function destroyArticle(id: number) : Promise<ActionReturn<Article>> {
    try {
        const article = await prisma.article.delete({
            where: { id },
            include: { articleSections: true }
        })
        // destroy all articlesections in article
        for (const articleSection of article.articleSections) {
            await destroyArticleSection(articleSection.name)
        }

        return { 
            success: true, 
            data: article
        }
    } catch (error) {
        return errorHandler(error)
    }
}
