import 'server-only'
import { articleSectionsRealtionsIncluder } from './ConfigVars'
import prisma from '@/prisma'
import { prismaCall } from '@/server/prismaCall'
import type { ExpandedArticleSection } from './Types'

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
