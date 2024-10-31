import { destroyArticle } from '@/services/cms/articles/destroy'
import { ServiceMethodHandler } from '@/services/ServiceMethodHandler'
import 'server-only'

/**
 * This handler destroys a jobAd. It is also responsible for cleaning up the article,
 * to avoid orphaned articles. It calls destroyArticle to destroy the article and its coverImage (cmsImage)
 * @param id - id of news article to destroy
 * @returns
 */
export const destroy = ServiceMethodHandler({
    withData: false,
    handler: async (prisma, { id }: { id: number }) => {
        const jobAd = await prisma.jobAd.delete({
            where: { id },
        })
        await destroyArticle(jobAd.articleId)
    }
})
