import 'server-only'
import { jobAdArticleRealtionsIncluder, simpleJobAdArticleRealtionsIncluder } from './ConfigVars'
import { ServerError } from '@/services/error'
import { ServiceMethodHandler } from '@/services/ServiceMethodHandler'
import type { ExpandedJobAd, JobAdInactiveCursor, JobAdInactiveDetails, SimpleJobAd } from './Types'
import { CompanyRelationIncluder } from '../companies/ConfigVars'
import { ReadPageInput } from '@/services/paging/Types'
import { cursorPageingSelection } from '@/services/paging/cursorPageingSelection'

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
            include: {
                ...jobAdArticleRealtionsIncluder,
                company: {
                    include: CompanyRelationIncluder,
                }
            }
        })
        if (!jobAd) throw new ServerError('NOT FOUND', `job ad ${idOrName} not found`)
        return jobAd
    }
})

/**
 * This handler reads all active jobAds
 * @returns SimpleJobAd[] - all jobAds with coverImage
 */
export const readActive = ServiceMethodHandler({
    withData: false,
    handler: async (prisma): Promise<SimpleJobAd[]> => {
        const jobAds = await prisma.jobAd.findMany({
            orderBy: {
                article: {
                    createdAt: 'desc',
                },
            },
            where: {
                active: true,
            },
            include: simpleJobAdArticleRealtionsIncluder,
        })
        return jobAds.map(ad => ({
            ...ad,
            coverImage: ad.article.coverImage.image,
            companyName: ad.company.name,
        }))
    }
})

/**
 * This handler reads a page of inactive jobAds
 * @param paging - the page to read, includes details to filter by name (articleName) and the type.
 */
export const readInactivePage = ServiceMethodHandler({
    withData: false,
    handler: async (prisma, params: {
        paging: ReadPageInput<number, JobAdInactiveCursor, JobAdInactiveDetails>
    }): Promise<SimpleJobAd[]> => {
        const jobAds = await prisma.jobAd.findMany({
            ...cursorPageingSelection(params.paging.page),
            where: {
                active: false,
                article: {
                    name: {
                        contains: params.paging.details.name || '',
                        mode: 'insensitive',
                    }
                },
                type: params.paging.details.type,
            },
            include: simpleJobAdArticleRealtionsIncluder
        })
        return jobAds.map(ad => ({
            ...ad,
            coverImage: ad.article.coverImage.image,
            companyName: ad.company.name,
        }))
    }
})