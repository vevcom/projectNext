import '@pn-server-only'
import { jobAdAuth } from './auth'
import { jobAdSchemas } from './schemas'
import { articleAndCompanyIncluder, simpleArticleAndCompanyIncluder } from './constants'
import { logoIncluder } from '@/services/career/companies/constants'
import { defineOperation } from '@/services/serviceOperation'
import { createArticle } from '@/services/cms/articles/create'
import { ServerError } from '@/services/error'
import { readPageInputSchemaObject } from '@/lib/paging/schema'
import { cursorPageingSelection } from '@/lib/paging/cursorPageingSelection'
import { destroyArticle } from '@/services/cms/articles/destroy'
import { z } from 'zod'
import { JobType } from '@prisma/client'
import type { ExpandedJobAd, SimpleJobAd } from './types'

export const jobAdOperations = {
    create: defineOperation({
        dataSchema: jobAdSchemas.create,
        authorizer: () => jobAdAuth.create.dynamicFields({}),
        operation: async ({ prisma, data: { articleName, companyId, ...data } }) => {
            const article = await createArticle({ name: articleName })

            return await prisma.jobAd.create({
                data: {
                    article: {
                        connect: {
                            id: article.id
                        }
                    },
                    company: {
                        connect: {
                            id: companyId
                        }
                    },
                    ...data,
                },
            })
        }
    }),
    /**
     * This handler reads a jobAd by id or articleName and order
     * @param idOrName - id or articleName and order of jobAd to read (id or {articleName: string, order: number})
     * @returns ExpandedJobAd - the jobAd and its article
     */
    read: defineOperation({
        paramsSchema: z.object({
            id: z.number()
        }),
        authorizer: () => jobAdAuth.read.dynamicFields({}),
        operation: async ({ prisma, params }): Promise<ExpandedJobAd> => await prisma.jobAd.findUniqueOrThrow({
            where: {
                id: params.id,
            },
            include: {
                ...articleAndCompanyIncluder,
                company: {
                    include: logoIncluder,
                }
            }
        })
    }),
    /**
     * This handler reads all active jobAds
     * @returns SimpleJobAd[] - all jobAds with coverImage
     */
    readActive: defineOperation({
        authorizer: () => jobAdAuth.readActive.dynamicFields({}),
        operation: async ({ prisma }): Promise<SimpleJobAd[]> => {
            const jobAds = await prisma.jobAd.findMany({
                orderBy: {
                    article: {
                        createdAt: 'desc',
                    },
                },
                where: {
                    active: true,
                },
                include: simpleArticleAndCompanyIncluder,
            })
            return jobAds.map(ad => ({
                ...ad,
                coverImage: ad.article.coverImage.image,
                companyName: ad.company.name,
            }))
        }
    }),
    /**
     * This handler reads a page of inactive jobAds
     * @param paging - the page to read, includes details to filter by name (articleName) and the type.
     */
    readInactivePage: defineOperation({
        paramsSchema: readPageInputSchemaObject(
            z.number(),
            z.object({
                id: z.number(),
            }),
            z.object({
                name: z.string().nullable(),
                type: z.nativeEnum(JobType).nullable(),
            }),
        ),
        authorizer: () => jobAdAuth.readInactivePage.dynamicFields({}),
        operation: async ({ prisma, params }): Promise<SimpleJobAd[]> => {
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
                include: simpleArticleAndCompanyIncluder,
            })
            return jobAds.map(ad => ({
                ...ad,
                coverImage: ad.article.coverImage.image,
                companyName: ad.company.name,
            }))
        }
    }),
    /**
     * This handler destroys a jobAd. It is also responsible for cleaning up the article,
     * to avoid orphaned articles. It calls destroyArticle to destroy the article and its coverImage (cmsImage)
     * @param id - id of news article to destroy
     * @returns
     */
    update: defineOperation({
        paramsSchema: z.object({
            id: z.number(),
        }),
        dataSchema: jobAdSchemas.update,
        authorizer: () => jobAdAuth.update.dynamicFields({}),
        operation: async ({ prisma, params: { id }, data }) => await prisma.jobAd.update({
            where: { id },
            data,
        })
    }),
    destroy: defineOperation({
        paramsSchema: z.object({
            id: z.number(),
        }),
        authorizer: () => jobAdAuth.destroy.dynamicFields({}),
        operation: async ({ prisma, params: { id } }) => {
            const jobAd = await prisma.jobAd.delete({
                where: { id },
            })
            await destroyArticle(jobAd.articleId)
        }
    }),
}
