import 'server-only'
import { createArticleCategorySchema } from './validation'
import prisma from '@/prisma'
import { prismaCall } from '@/server/prismaCall'
import type { CreateArticleCategoryTypes } from './validation'
import type { ExpandedArticleCategory } from './Types'

export async function createArticleCategory(rawData: CreateArticleCategoryTypes['Detailed']): Promise<ExpandedArticleCategory> {
    const data = createArticleCategorySchema.detailedValidate(rawData)

    return await prismaCall(() => prisma.articleCategory.create({
        data,
        include: {
            articles: true
        },
    }))
}
