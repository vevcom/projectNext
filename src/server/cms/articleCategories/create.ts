import 'server-only'
import { createArticleCategorySchema } from './schema'
import prisma from '@/prisma'
import { prismaCall } from '@/server/prismaCall'
import type { CreateArticleCategoryType } from './schema'
import type { ExpandedArticleCategory } from './Types'

export async function createArticleCategory(rawData: CreateArticleCategoryType): Promise<ExpandedArticleCategory> {
    const data = createArticleCategorySchema.detailedValidate(rawData)

    return await prismaCall(() => prisma.articleCategory.create({
        data,
        include: {
            articles: true
        },
    }))
}
