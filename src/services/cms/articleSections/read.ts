import 'server-only'
import { articleSectionsRealtionsIncluder } from '@/cms/articleSections/ConfigVars'
import prisma from '@/prisma'
import { ServerError } from '@/services/error'
import { prismaCall } from '@/services/prismaCall'
import type { ExpandedArticleSection } from '@/cms/articleSections/Types'
import { CmsLinks } from '../links'
import { ServiceMethodHandler } from '@/services/ServiceMethodHandler'

/**
 * Validates and collapses an article section. This means changing the cmsLink to a valid cmsLink
 * by collapsing the cmsLink
 */
export const validateAndCollapseArticleSection = ServiceMethodHandler({
    withData: false,
    handler: async (
        prisma, 
        articleSection: ExpandedArticleSection<false>
    ) : Promise<ExpandedArticleSection<true>> => ({
        ...articleSection,
        cmsLink: articleSection.cmsLink ? 
            await CmsLinks.validateAndCollapseCmsLink.client(prisma).execute({ params: articleSection.cmsLink, session: null }) :
            null
    })
})

/**
 * Reads an article section
 * @param nameOrId - The name or id of the article section to read
 * @returns
 */
export async function readArticleSection(nameOrId: string | number): Promise<ExpandedArticleSection<true>> {
    const articleSection = await prismaCall(() => prisma.articleSection.findUnique({
        where: {
            name: typeof nameOrId === 'string' ? nameOrId : undefined,
            id: typeof nameOrId === 'number' ? nameOrId : undefined
        },
        include: articleSectionsRealtionsIncluder
    }))
    if (!articleSection) throw new ServerError('NOT FOUND', 'Article section not found')
    return validateAndCollapseArticleSection.client(prisma).execute({ params: articleSection, session: null })
}