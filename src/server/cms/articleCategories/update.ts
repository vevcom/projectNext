import 'server-only'
import { updateArticleCategorySchema } from './schema'
import prisma from '@/prisma'
import { prismaCall } from '@/server/prismaCall'
import type { UpdateArticleCategoryType } from './schema'
import type { ExpandedArticleCategory } from '@/cms/articleCategories/Types'

export async function updateArticleCategory(
    id: number,
    rawData: UpdateArticleCategoryType,
): Promise<ExpandedArticleCategory> {
    const data = updateArticleCategorySchema.detailedValidate(rawData)

    return await prismaCall(() => prisma.articleCategory.update({
        where: {
            id
        },
        data,
        include: {
            articles: true
        }
    }))
}
