'use server'
import { createArticleSection } from './create'
import prisma from '@/prisma'
import { createPrismaActionError } from '@/actions/error'
import type { ActionReturn } from '@/actions/Types'
import type { ExpandedArticleSection } from './Types'
import { articleSectionsRealtionsIncluder } from './ConfigVars'

// Note that this function creates a new articleSection if it doesn't exist
export async function readArticleSection(name: string): Promise<ActionReturn<ExpandedArticleSection>> {
    try {
        const articleSection = await prisma.articleSection.findUnique({
            where: {
                name
            },
            include: articleSectionsRealtionsIncluder
        })
        if (articleSection) return { success: true, data: articleSection }
        const createRes = await createArticleSection(name)
        return createRes
    } catch (error) {
        return createPrismaActionError(error)
    }
}
