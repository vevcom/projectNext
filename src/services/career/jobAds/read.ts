import 'server-only'
import { jobAdArticleRealtionsIncluder, simpleJobAdArticleRealtionsIncluder } from './ConfigVars'
import { ServerError } from '@/services/error'
import { ServiceMethodHandler } from '@/services/ServiceMethodHandler'
import type { ExpandedJobAd, SimpleJobAd } from './Types'

/**
 * This handler reads a jobAd by id or articleName and order
 * @param idOrName - id or articleName and order of jobAd to read (id or {articleName: string, order: number})
 * @returns ExpandedJobAd - the jobAd and its article
 */
export const read = ServiceMethodHandler({
    withData: false,
    handler: async (prisma, { idOrName }: { idOrName: number | {
        articleName: string
        order: number
    } }): Promise<ExpandedJobAd> => {
        const jobAd = await prisma.jobAd.findUnique({
            where: typeof idOrName === 'number' ? {
                id: idOrName
            } : {
                articleName_orderPublished: {
                    articleName: idOrName.articleName,
                    orderPublished: idOrName.order
                }
            },
            include: jobAdArticleRealtionsIncluder
        })
        if (!jobAd) throw new ServerError('NOT FOUND', `job ad ${idOrName} not found`)
        return jobAd
    }
})

/**
 * This handler reads all current jobAds
 * @returns SimpleJobAd[] - all jobAds with coverImage
 */
export const readCurrent = ServiceMethodHandler({
    withData: false,
    handler: async (prisma): Promise<SimpleJobAd[]> => {
        const jobAds = await prisma.jobAd.findMany({
            orderBy: {
                article: {
                    createdAt: 'desc',
                },
            },
            //TODO: only "current"
            include: simpleJobAdArticleRealtionsIncluder,
        })
        return jobAds.map(ad => ({
            ...ad,
            coverImage: ad.article.coverImage.image
        }))
    }
})
