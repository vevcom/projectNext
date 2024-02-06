'use server'
import { ReturnType } from './ReturnType'
import { ActionReturn } from '@/actions/type'
import prisma from '@/prisma'
import errorHandeler from '@/prisma/errorHandler'

export default async function read(id: number): Promise<ActionReturn<ReturnType>> {
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
