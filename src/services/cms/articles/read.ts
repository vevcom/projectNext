import '@pn-server-only'
import { articleRealtionsIncluder } from './ConfigVars'
import { prisma } from '@/prisma/client'
import { ServerError } from '@/services/error'
import { prismaCall } from '@/services/prismaCall'
import type { ExpandedArticle } from './types'

/**
 * A function that reads an article with all the neccessary data included like paragraphs, images, etc...
 * @param idOrName - The id or name + category of the article to read
 * @returns
 */
export async function readArticle(idOrName: number | {
    name: string,
    category: string
}): Promise<ExpandedArticle> {
    const article = await prismaCall(() => prisma.article.findUnique({
        where: typeof idOrName === 'number' ? {
            id: idOrName
        } : {
            articleCategoryName_name: {
                articleCategoryName: idOrName.category,
                name: idOrName.name,
            }
        },
        include: articleRealtionsIncluder,
    }))
    if (!article) throw new ServerError('NOT FOUND', `Article ${idOrName} not found`)
    if (!article.coverImage) throw new ServerError('BAD PARAMETERS', `Article ${idOrName} has no cover image`)
    const ret: ExpandedArticle = {
        ...article,
        coverImage: article.coverImage
    }
    return ret
}
