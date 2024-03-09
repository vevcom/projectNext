'use server'
import prisma from '@/prisma'
import { createPrismaActionError } from '@/actions/error'
import type { ActionReturn } from '@/actions/Types'
import type { ExpandedArticleSection } from './Types'
import { articleSectionsRealtionsIncluder } from './ConfigVars'


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
