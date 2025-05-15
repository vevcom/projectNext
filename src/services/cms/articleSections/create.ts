import '@pn-server-only'
import { articleSectionsRealtionsIncluder } from './ConfigVars'
import { createArticleSectionValidation } from './validation'
import prisma from '@/prisma'
import { prismaCall } from '@/services/prismaCall'
import type { CreateArticleSectionTypes } from './validation'
import type { ExpandedArticleSection } from './Types'

/**
 * A function to create a new articleSection
 * @param name - The name of the article section to create
 * @returns
 */
export async function createArticleSection(
    rawData: CreateArticleSectionTypes['Detailed']
): Promise<ExpandedArticleSection> {
    const data = createArticleSectionValidation.detailedValidate(rawData)

    return await prismaCall(() => prisma.articleSection.create({
        data,
        include: articleSectionsRealtionsIncluder,
    }))
}
