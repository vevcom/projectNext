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
            const res = await destroyArticleSection(articleSection.name)
            if (!res.success) return res
        }

        // destroy article
        await prisma.article.delete({
            where: { id }
        })

        // destroy coverimage
        if (article.coverImageId) {
            await prisma.cmsImage.delete({
                where: { id: article.coverImageId }
            })
        }

        return { 
            success: true, 
            data: article
        }
    } catch (error) {
        console.log('hhuuhuuhu')
        return errorHandler(error)
    }
}
