import 'server-only'
import prisma from '@/prisma'
import { prismaCall } from '@/server/prismaCall'
import type { ExpandedArticleCategory } from '@/cms/articleCategories/Types'
import type { ActionReturn } from '@/actions/Types'

export async function destroyArticleCategory(id: number): Promise<ExpandedArticleCategory> {
    return await prismaCall(() => prisma.articleCategory.delete({
        where: {
            id
        },
        include: {
            articles: true
        }
    }))
}
