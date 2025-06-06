import '@pn-server-only'
import { updateArticleCategoryValidation } from './validation'
import prisma from '@/prisma'
import { prismaCall } from '@/services/prismaCall'
import type { UpdateArticleCategoryTypes } from './validation'
import type { ExpandedArticleCategory } from '@/cms/articleCategories/Types'

export async function updateArticleCategory(
    id: number,
    rawData: UpdateArticleCategoryTypes['Detailed'],
): Promise<ExpandedArticleCategory> {
    const data = updateArticleCategoryValidation.detailedValidate(rawData)

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
