'use server'
import { createArticleSection } from './create'
import prisma from '@/prisma'
import errorHandler from '@/prisma/errorHandler'
import type { ActionReturn } from '@/actions/Types'
import type { ReturnType } from './ReturnType'

// Note that this function creates a new articleSection if it doesn't exist
export async function readArticle(name: string): Promise<ActionReturn<ReturnType>> {
    try {
        const articleSection = await prisma.articleSection.findUnique({
            where: {
                name
            },
            include: {
                cmsImage: true,
                cmsParagraph: true,
                cmsLink: true
            }
        })
        if (articleSection) return { success: true, data: articleSection }
        const createRes = await createArticleSection(name)
        return createRes
    } catch (error) {
        return errorHandler(error)
    }
}
