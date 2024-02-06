'use server'
import prisma from '@/prisma'
import errorHandler from '@/prisma/errorHandler'
import type { ActionReturn } from '@/actions/type'
import type { ArticleSection } from '@prisma/client'

export async function destroyArticleSection(name: string): Promise<ActionReturn<ArticleSection>> {
    try {
        const articleSection = await prisma.articleSection.delete({
            where: { name },
        })
        return { success: true, data: articleSection }
    } catch (error) {
        return errorHandler(error)
    }
}
