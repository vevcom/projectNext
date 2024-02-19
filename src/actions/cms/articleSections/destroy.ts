'use server'
import prisma from '@/prisma'
import errorHandler from '@/prisma/errorHandler'
import type { ActionReturn } from '@/actions/type'
import type { ArticleSection } from '@prisma/client'

export async function destroyArticleSection(name: string): Promise<ActionReturn<ArticleSection>> {
    try {
        const articleSection = await prisma.articleSection.findUnique({
            where: { name },
        })
        if (!articleSection) return { success: false, error: [{message: 'ArticleSection not found'}] }

        // destroy cms link, paragraph and image relations
        // prisma cant handle cascades for these types of one waay optional cascades
        if (articleSection.cmsLinkId)
            await prisma.cmsLink.delete({
                where: { id: articleSection.cmsLinkId },
            })
        if (articleSection.cmsParagraphId)
            await prisma.cmsParagraph.delete({
                where: { id: articleSection.cmsParagraphId },
            })
        if (articleSection.cmsImageId)
            await prisma.cmsImage.delete({
                where: { id: articleSection.cmsImageId },
            })
        
        await prisma.articleSection.delete({
            where: { name },
        })
        return { success: true, data: articleSection }
    } catch (error) {
        return errorHandler(error)
    }
}
