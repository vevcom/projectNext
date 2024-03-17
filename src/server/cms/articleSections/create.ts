import 'server-only'
import { articleSectionsRealtionsIncluder } from './ConfigVars'
import prisma from '@/prisma'
import type { ExpandedArticleSection } from './Types'
import { prismaCall } from '@/server/prismaCall'

/**
 * A function to create a new articleSection
 * @param name - The name of the article section to create
 * @returns
 */
export async function createArticleSection(name: string): Promise<ExpandedArticleSection> {
    return await prismaCall(() => prisma.articleSection.create({
        data: {
            name,
        },
        include: articleSectionsRealtionsIncluder
    }))
}
