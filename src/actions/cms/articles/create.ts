'use server'
import prisma from '@/prisma'
import errorHandeler from '@/prisma/errorHandler'
import type { ReturnType } from './ReturnType'
import type { ActionReturn } from '@/actions/Types'

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
