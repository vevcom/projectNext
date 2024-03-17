import 'server-only'
import prisma from '@/prisma'
import type { Prisma } from '@prisma/client'
import type { ExpandedArticleCategory } from './Types'
import { prismaCall } from '@/server/prismaCall'

export async function createArticleCategory(
    data: Required<Pick<Prisma.ArticleCategoryCreateInput, 'description' | 'name'>>
): Promise<ExpandedArticleCategory> {
    return await prismaCall(() => prisma.articleCategory.create({
        data,
        include: {
            articles: true
        },
    }))
}
