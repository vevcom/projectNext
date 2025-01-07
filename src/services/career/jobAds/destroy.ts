import 'server-only'
import { DestroyJobAdAuther } from './Authers'
import { destroyArticle } from '@/services/cms/articles/destroy'
import { ServiceMethod } from '@/services/ServiceMethod'
import { z } from 'zod'

/**
 * This handler destroys a jobAd. It is also responsible for cleaning up the article,
 * to avoid orphaned articles. It calls destroyArticle to destroy the article and its coverImage (cmsImage)
 * @param id - id of news article to destroy
 * @returns
 */
export const destroyJobAd = ServiceMethod({
    paramsSchema: z.object({
        id: z.number(),
    }),
    auther: DestroyJobAdAuther,
    dynamicAuthFields: () => ({}),
    method: async ({ prisma, params: { id } }) => {
        const jobAd = await prisma.jobAd.delete({
            where: { id },
        })
        await destroyArticle(jobAd.articleId)
    }
})
