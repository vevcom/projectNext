import '@pn-server-only'
import { prisma } from '@/prisma/client'
import { prismaCall } from '@/services/prismaCall'
import type { Article } from '@prisma/client'
import { cmsImageOperations } from '../images/operations'

/**
 * A function that destroys an article and its cover image (must be deleted to to avoid
 * orphaned cmsimages)
 * @param id - The id of the article to destroy
 * @returns
 */
export async function destroyArticle(id: number): Promise<Article> {
    const article = await prismaCall(() => prisma.article.delete({
        where: { id }
    }))

    // delete coverimage to avoid orphaned cmsimages
    await cmsImageOperations.destroy({
        params: { id: article.coverImageId },
        bypassAuth: true
    })

    return article
}
