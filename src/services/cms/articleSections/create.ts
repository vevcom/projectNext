import 'server-only'
import { createArticleSectionValidation } from './validation'
import prisma from '@/prisma'
import { prismaCall } from '@/services/prismaCall'
import type { ArticleSection } from '@prisma/client'
import type { CreateArticleSectionTypes } from './validation'

/**
 * A function to create a new articleSection
 * @param name - The name of the article section to create
 * @returns
 */
export async function createArticleSection(
    rawData: CreateArticleSectionTypes['Detailed']
): Promise<ArticleSection> {
    const data = createArticleSectionValidation.detailedValidate(rawData)

    return await prismaCall(() => prisma.articleSection.create({
        data,
    }))
}
