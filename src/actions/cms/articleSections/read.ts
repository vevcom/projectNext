'use server'
import { articleSectionsRealtionsIncluder } from '@/cms/articleSections/ConfigVars'
import prisma from '@/prisma'
import { createActionError, createPrismaActionError } from '@/actions/error'
import type { ActionReturn } from '@/actions/Types'
import type { ExpandedArticleSection } from '@/cms/articleSections/Types'

export async function readArticleSection(name: string): Promise<ActionReturn<ExpandedArticleSection>> {
    try {
        const articleSection = await prisma.articleSection.findUnique({
            where: {
                name
            },
            include: articleSectionsRealtionsIncluder
        })
        if (!articleSection) return createActionError('NOT FOUND', 'Article section not found')
        return { success: true, data: articleSection }
    } catch (error) {
        return createPrismaActionError(error)
    }
}
