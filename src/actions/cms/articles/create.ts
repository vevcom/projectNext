'use server'
import prisma from '@/prisma'
import errorHandler from '@/prisma/errorHandler'
import type { ReturnType } from './ReturnType'
import type { ActionReturn } from '@/actions/type'

export async function createArticle(name: string | null, config: {
    categoryId: number,
}): Promise<ActionReturn<ReturnType>> {
    try {
        // if name not given, create a unique new name
        if (name === null) {
            let i = 1;
            name = 'ny artikkel';
            while (await prisma.article.findUnique({ where: { name } })) {
                name = `ny artikkel ${i++}`;
            }
        }


        const article = await prisma.article.create({
            data: {
                name,
                coverImage: {
                    create: {
                        name: `${name}_cover`,
                    }
                },
                articleCategory: {
                    connect: {
                        id: config.categoryId
                    }
                }
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
