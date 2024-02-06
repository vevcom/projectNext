'use server'
import { ReturnType } from './ReturnType'
import { ActionReturn } from '@/actions/type'
import prisma from '@/prisma'
import errorHandeler from '@/prisma/errorHandler'

export async function createArticle(name: string): Promise<ActionReturn<ReturnType>> {
    try {
        const article = await prisma.article.create({
            data: {
                name,
                coverImage: {
                    create: {
                        name: `${name}_cover`,
                    }
                },
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
        return { success: true, data: article }
    } catch (error) {
        return errorHandeler(error)
    }
}
