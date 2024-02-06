'use server'
import { ActionReturn } from '@/actions/type'
import prisma from '@/prisma'
import errorHandler from '@/prisma/errorHandler'
import type { ReturnType } from './ReturnType'


export async function createArticleSection(name: string): Promise<ActionReturn<ReturnType>> {
    try {
        const articleSection = await prisma.articleSection.create({
            data: {
                name,
            },
            include: {
                cmsImage: true,
                cmsParagraph: true,
                cmsLink: true
            }
        })
        return { success: true, data: articleSection }
    } catch (error) {
        return errorHandler(error)
    }
}
