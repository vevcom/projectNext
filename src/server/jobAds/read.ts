'use server'
import prisma from '@/prisma'
import { createActionError } from '@/actions/error'
import type { ExpandedJobAd } from './Types'
import type { ActionReturn, ReadPageInput } from '@/actions/Types'


export async function readJobAdByNameAndOrder(idOrName: number | {
    articleName: string
    order: number
}): Promise<ActionReturn<ExpandedJobAd>> {
        const news = await prisma.newsArticle.findUnique({
            where: typeof idOrName === 'number' ? {
                id: idOrName
            } : {
                articleName_orderPublished: {
                    articleName: idOrName.articleName,
                    orderPublished: idOrName.order
                }
            },
            include: newsArticleRealtionsIncluder
        })
        if (!news) return createActionError('NOT FOUND', `article ${idOrName} not found`)
        return { success: true, data: news }
   
}
