'use server'
import prisma from '@/prisma'
import { createPrismaActionError } from '@/actions/error'
import type { ActionReturn } from '@/actions/Types'
import type { ExpandedArticleSection } from './Types'


export async function createArticleSection(name: string): Promise<ActionReturn<ExpandedArticleSection>> {
    try {
        const articleSection = await prisma.articleSection.create({
            data: {
                name,
            },
            include: {
                cmsImage: {
                    include: {
                        image: true
                    },
                },
                cmsParagraph: true,
                cmsLink: true
            }
        })
        return { success: true, data: articleSection }
    } catch (error) {
        return createPrismaActionError(error)
    }
}
