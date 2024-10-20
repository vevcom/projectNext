import 'server-only'
import { jobAdArticleRealtionsIncluder, simpleJobAdArticleRealtionsIncluder } from './ConfigVars'
import { ServerError } from '@/services/error'
import type { ExpandedJobAd, SimpleJobAd } from './Types'
import { ServiceMethodHandler } from '@/services/ServiceMethodHandler'

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

export const readCurrent = ServiceMethodHandler({
    withData: false,
    handler: async (prisma): Promise<SimpleJobAd[]> => {
        console.log('readCurrent')
        const jobAds = await prisma.jobAd.findMany({
            orderBy: {
                article: {
                    createdAt: 'desc',
                },
            },
            include: simpleJobAdArticleRealtionsIncluder,
        })
        return jobAds.map(ad => ({
            ...ad,
            coverImage: ad.article.coverImage.image
        }))
    } 
})