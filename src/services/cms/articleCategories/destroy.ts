import '@pn-server-only'
import { prisma } from '@/prisma/client'
import { prismaCall } from '@/services/prismaCall'
import type { ExpandedArticleCategory } from '@/cms/articleCategories/Types'

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
