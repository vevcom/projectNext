'use server'
import prisma from '@/prisma'
import errorHandeler from '@/prisma/errorHandler'
import type { ReturnType } from './ReturnType'
import type { ActionReturn } from '@/actions/Types'

export async function readArticle(id: number): Promise<ActionReturn<ReturnType>> {
    try {
        const article = await prisma.article.findUnique({
            where: {
                id
            },
            include: {
                articleSections: {
                    include: {
                        cmsImage: true,
                        cmsParagraph: true,
                        cmsLink: true
                    }
                },
                coverImage: true,
            }
        })
        if (!article) return { success: false, error: [{ message: `Article ${name} not found` }] }
        return { success: true, data: article }
    } catch (error) {
        return errorHandeler(error)
    }
}
