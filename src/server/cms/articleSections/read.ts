import 'server-only'
import { articleSectionsRealtionsIncluder } from '@/cms/articleSections/ConfigVars'
import prisma from '@/prisma'
import { createActionError, createPrismaActionError } from '@/actions/error'
import type { ActionReturn } from '@/actions/Types'
import type { ExpandedArticleSection } from '@/cms/articleSections/Types'

/**
 * Reads an article section
 * @param nameOrId - The name or id of the article section to read
 * @returns
 */
export async function readArticleSection(nameOrId: string | number): Promise<ActionReturn<ExpandedArticleSection>> {
    try {
        const articleSection = await prisma.articleSection.findUnique({
            where: {
                name: typeof nameOrId === 'string' ? nameOrId : undefined,
                id: typeof nameOrId === 'number' ? nameOrId : undefined
            },
            include: articleSectionsRealtionsIncluder
        })
        if (!articleSection) return createActionError('NOT FOUND', 'Article section not found')
        return { success: true, data: articleSection }
    } catch (error) {
        return createPrismaActionError(error)
    }
}
