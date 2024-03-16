import 'server-only'
import { destroyCmsImage } from '@/cms/images/destoy'
import prisma from '@/prisma'
import { createPrismaActionError } from '@/actions/error'
import type { ActionReturn } from '@/actions/Types'
import type { Article } from '@prisma/client'

/**
 * A function that destroys an article and its cover image (must be deleted to to avoid
 * orphaned cmsimages)
 * @param id - The id of the article to destroy
 * @returns
 */
export async function destroyArticle(id: number): Promise<ActionReturn<Article>> {
    try {
        const article = await prisma.article.delete({
            where: { id }
        })

        // delete coverimage to avoid orphaned cmsimages
        await destroyCmsImage(article.coverImageId)

        return {
            success: true,
            data: article
        }
    } catch (error) {
        return createPrismaActionError(error)
    }
}
