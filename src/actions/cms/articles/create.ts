'use server'
import prisma from '@/prisma'
import errorHandler from '@/prisma/errorHandler'
import type { ReturnType } from './Types'
import type { ActionReturn } from '@/actions/Types'

export async function createArticle(name: string | null, config?: {
    categoryId: number,
}): Promise<ActionReturn<ReturnType>> {
    try {
        // if name not given, create a unique new name
        if (name === null) {
            let i = 1
            name = 'ny artikkel'
            while (await prisma.article.findUnique({ where: { name } })) {
                name = `ny artikkel ${i++}`
            }
        }


        const article = await prisma.article.create({
            data: {
                name,
                coverImage: {
                    create: {}
                },
                articleCategory: config ? {
                    connect: {
                        id: config.categoryId
                    }
                } : undefined
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
        return errorHandler(error)
    }
}
