import prisma from '@/prisma'
import errorHandler from '@/prisma/errorHandler'
import type { Article } from '@prisma/client'
import { ActionReturn } from '@/actions/type'
import { destroyArticleSection } from '../articleSections/destroy'

export async function destroyArticle(id: number) : Promise<ActionReturn<Article>> {
    try {
        const article = await prisma.article.findUnique({
            where: { id },
            include: { articleSections: true }
        })
        if (!article) return { success: false, error: [{message: 'Article not found'}] }


        // destroy all articlesections in article
        for (const articleSection of article.articleSections) {
            await destroyArticleSection(articleSection.name)
        }
        
        // destroy coverimage
        if (article.coverImageId) {
            await prisma.cmsImage.delete({
                where: { id: article.coverImageId }
            })
        }

        await prisma.article.delete({
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
