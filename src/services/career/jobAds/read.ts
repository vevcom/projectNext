import 'server-only'
import { jobAdArticleRealtionsIncluder, simpleJobAdArticleRealtionsIncluder } from './ConfigVars'
import { ReadJobAdAuther } from './Authers'
import { CompanyRelationIncluder } from '@/career/companies/ConfigVars'
import { ServerError } from '@/services/error'
import { cursorPageingSelection } from '@/lib/paging/cursorPageingSelection'
import { ServiceMethod } from '@/services/ServiceMethod'
import { readPageInputSchemaObject } from '@/lib/paging/schema'
import { z } from 'zod'
import { JobType } from '@prisma/client'
import type { ExpandedJobAd, SimpleJobAd } from './Types'

/**
 * This handler reads a jobAd by id or articleName and order
 * @param idOrName - id or articleName and order of jobAd to read (id or {articleName: string, order: number})
 * @returns ExpandedJobAd - the jobAd and its article
 */
export const readJobAd = ServiceMethod({
    paramsSchema: z.object({
        idOrName: z.union([
            z.number(),
            z.object({
                articleName: z.string(),
                order: z.number(),
            }),
        ]),
    }),
    auther: ReadJobAdAuther,
    dynamicAuthFields: () => ({}),
    method: async ({ prisma, params: { idOrName } }): Promise<ExpandedJobAd> => {
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
export const readActiveJobAds = ServiceMethod({
    auther: ReadJobAdAuther,
    dynamicAuthFields: () => ({}),
    method: async ({ prisma }): Promise<SimpleJobAd[]> => {
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
export const readInactiveJobAdsPage = ServiceMethod({
    paramsSchema: readPageInputSchemaObject(
        z.number(),
        z.object({
            id: z.number(),
        }),
        z.object({
            name: z.string().nullable(),
            type: z.nativeEnum(JobType).nullable(),
        }),
    ), // Created from ReadPageInput<number, JobAdInactiveCursor, JobAdInactiveDetails>
    auther: ReadJobAdAuther,
    dynamicAuthFields: () => ({}),
    method: async ({ prisma, params }): Promise<SimpleJobAd[]> => {
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
                type: params.paging.details.type || undefined,
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
