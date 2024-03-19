import 'server-only'
import { articleSectionsRealtionsIncluder } from './ConfigVars'
import { createArticleSectionSchema } from './schema'
import prisma from '@/prisma'
import { prismaCall } from '@/server/prismaCall'
import type { CreateArticleSectionType } from './schema'
import type { ExpandedArticleSection } from './Types'

/**
 * A function to create a new articleSection
 * @param name - The name of the article section to create
 * @returns
 */
export async function createArticleSection(rawData: CreateArticleSectionType): Promise<ExpandedArticleSection> {
    const data = createArticleSectionSchema.detailedValidate(rawData)

    return await prismaCall(() => prisma.articleSection.create({
        data,
        include: articleSectionsRealtionsIncluder,
    }))
}
