'use server'
import { ActionReturn } from '@/actions/type'
import { ReturnType } from './ReturnType'
import prisma from '@/prisma'
import errorHandeler from '@/prisma/errorHandler'

export default async function read(name: string): Promise<ActionReturn<ReturnType>> {
    try {
        const article = await prisma.article.findUnique({
            where: {
                name
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
        if (!article) return { success: false, error: [{message: `Article ${name} not found`}] }
        return { success: true, data: article }
    } catch (error) {
        return errorHandeler(error)
    }
}