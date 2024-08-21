import 'server-only'
import { jobAdArticleRealtionsIncluder, simpleJobAdArticleRealtionsIncluder } from './ConfigVars'
import prisma from '@/prisma'
import { prismaCall } from '@/services/prismaCall'
import { ServerError } from '@/services/error'
import type { ExpandedJobAd, SimpleJobAd } from './Types'

export async function readJobAdByNameAndOrder(idOrName: number | {
    articleName: string
    order: number
}): Promise<ExpandedJobAd> {
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

export async function readJobAdsCurrent(): Promise<SimpleJobAd[]> {
    const jobAds = await prismaCall(() => prisma.jobAd.findMany({
        orderBy: {
            article: {
                createdAt: 'desc',
            },
        },
        include: simpleJobAdArticleRealtionsIncluder,
    }))
    return jobAds.map(ad => ({
        ...ad,
        coverImage: ad.article.coverImage.image
    }))
}
