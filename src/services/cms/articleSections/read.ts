import '@pn-server-only'
import { articleSectionsRealtionsIncluder } from '@/cms/articleSections/ConfigVars'
import { prisma } from '@/prisma/client'
import { ServerError } from '@/services/error'
import { prismaCall } from '@/services/prismaCall'
import type { ExpandedArticleSection } from '@/cms/articleSections/Types'

/**
 * Reads an article section
 * @param nameOrId - The name or id of the article section to read
 * @returns
 */
export async function readArticleSection(nameOrId: string | number): Promise<ExpandedArticleSection> {
    const articleSection = await prismaCall(() => prisma.articleSection.findUnique({
        where: {
            name: typeof nameOrId === 'string' ? nameOrId : undefined,
            id: typeof nameOrId === 'number' ? nameOrId : undefined
        },
        include: articleSectionsRealtionsIncluder
    }))
    if (!articleSection) throw new ServerError('NOT FOUND', 'Article section not found')
    return articleSection
}
