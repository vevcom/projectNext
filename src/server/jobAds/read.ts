import 'server-only'
import prisma from '@/prisma'
import { createActionError } from '@/actions/error'
import type { ExpandedJobAd, SimpleJobAd } from './Types'
import type { ActionReturn, ReadPageInput } from '@/actions/Types'
import { jobAdArticleRealtionsIncluder } from './ConfigVars'
import { prismaCall } from '@/server/prismaCall'
import { ServerError } from '@/server/error'
import { simpleJobAdArticleRealtionsIncluder } from './ConfigVars'

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