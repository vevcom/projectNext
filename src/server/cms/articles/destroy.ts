import 'server-only'
import { destroyCmsImage } from '@/cms/images/destoy'
import prisma from '@/prisma'
import type { Article } from '@prisma/client'
import { prismaCall } from '@/server/prismaCall'

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
    await destroyCmsImage(article.coverImageId)

    return article
}
