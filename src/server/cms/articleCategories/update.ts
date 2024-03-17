import 'server-only'
import prisma from '@/prisma'
import type { Prisma } from '@prisma/client'
import type { ExpandedArticleCategory } from '@/cms/articleCategories/Types'
import { prismaCall } from '@/server/prismaCall'

export async function updateArticleCategory(
    id: number,
    data: Required<Pick<Prisma.ArticleCategoryUpdateInput, 'name' | 'description'>>
): Promise<ExpandedArticleCategory> {
    return await prismaCall(() =>prisma.articleCategory.update({
        where: {
            id
        },
        data,
        include: {
            articles: true
        }
    }))
}
