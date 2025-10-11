import '@pn-server-only'
import { createArticleCategoryValidation } from './validation'
import { prisma } from '@/prisma/client'
import { prismaCall } from '@/services/prismaCall'
import type { CreateArticleCategoryTypes } from './validation'
import type { ExpandedArticleCategory } from './types'

export async function createArticleCategory(
    rawData: CreateArticleCategoryTypes['Detailed']
): Promise<ExpandedArticleCategory> {
    const data = createArticleCategoryValidation.detailedValidate(rawData)

    return await prismaCall(() => prisma.articleCategory.create({
        data,
        include: {
            articles: true
        },
    }))
}
