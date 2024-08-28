import 'server-only'
import { prismaCall } from '@/server/prismaCall'
import { destroyArticle } from '@/server/cms/articles/destroy'
import prisma from '@/prisma'
import type { SimpleJobAd } from './Types'

/**
 * This function destroys a jobAd. It is also responsible for cleaning up the article,
 * to avoid orphaned articles. It calls destroyArticle to destroy the article and its coverImage (cmsImage)
 * @param id - id of news article to destroy
 * @returns
 */
export async function destroyJobAd(id: number): Promise<Omit<SimpleJobAd, 'coverImage'>> {
    const jobAd = await prismaCall(() => prisma.jobAd.delete({
        where: {
            id
        }
    }))
    await destroyArticle(jobAd.articleId) //This function also destoys cover cms image
    return jobAd
}
