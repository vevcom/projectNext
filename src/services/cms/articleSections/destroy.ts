import 'server-only'
import prisma from '@/prisma'
import { prismaCall } from '@/services/prismaCall'
import type { ArticleSection } from '@prisma/client'

/**
 * Destroys an article section
 * @param nameOrId - The name or id of the article section to destroy
 * @returns
 */
export async function destroyArticleSection(nameOrId: string | number): Promise<ArticleSection> {
    return await prismaCall(() => prisma.articleSection.delete({
        where: {
            name: typeof nameOrId === 'string' ? nameOrId : undefined,
            id: typeof nameOrId === 'number' ? nameOrId : undefined
        },
    }))
}
