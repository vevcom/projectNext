import 'server-only'
import { articleSectionsRealtionsIncluder } from './ConfigVars'
import prisma from '@/prisma'
import { createPrismaActionError } from '@/actions/error'
import type { ActionReturn } from '@/actions/Types'
import type { ExpandedArticleSection } from './Types'

/**
 * A function to create a new articleSection
 * @param name - The name of the article section to create
 * @returns
 */
export async function createArticleSection(name: string): Promise<ActionReturn<ExpandedArticleSection>> {
    try {
        const articleSection = await prisma.articleSection.create({
            data: {
                name,
            },
            include: articleSectionsRealtionsIncluder
        })
        return { success: true, data: articleSection }
    } catch (error) {
        return createPrismaActionError(error)
    }
}
