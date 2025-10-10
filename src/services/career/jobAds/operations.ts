import '@pn-server-only'
import { jobAdAuthers } from './authers'
import { jobAdSchemas } from './schemas'
import { articleAndCompanyIncluder, simpleArticleAndCompanyIncluder } from './constants'
import { logoIncluder } from '@/services/career/companies/constants'
import { defineOperation } from '@/services/serviceOperation'
import { readCurrentOmegaOrder } from '@/services/omegaOrder/read'
import { createArticle } from '@/services/cms/articles/create'
import { ServerError } from '@/services/error'
import { readPageInputSchemaObject } from '@/lib/paging/schema'
import { cursorPageingSelection } from '@/lib/paging/cursorPageingSelection'
import { destroyArticle } from '@/services/cms/articles/destroy'
import { z } from 'zod'
import { JobType } from '@prisma/client'
import type { ExpandedJobAd, SimpleJobAd } from './Types'

export const jobAdOperations = {
    create: defineOperation({
        dataSchema: jobAdSchemas.create,
        authorizer: () => jobAdAuthers.create.dynamicFields({}),
        operation: async ({ prisma, data: { articleName, companyId, ...data } }) => {
            const article = await createArticle({ name: articleName })

            const currentOrder = await readCurrentOmegaOrder()

            return await prisma.jobAd.create({
                data: {
                    article: {
                        connect: {
                            id: article.id
                        }
                    },
                    omegaOrder: {
                        connect: currentOrder,
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
            idOrName: z.union([
                z.number(),
                z.object({
                    articleName: z.string(),
                    order: z.number(),
                }),
            ]),
        }),
        authorizer: () => jobAdAuthers.read.dynamicFields({}),
        operation: async ({ prisma, params: { idOrName } }): Promise<ExpandedJobAd> => {
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
                    ...articleAndCompanyIncluder,
                    company: {
                        include: logoIncluder,
                    }
                }
            })
            if (!jobAd) throw new ServerError('NOT FOUND', `job ad ${idOrName} not found`)
            return jobAd
        }
    }),
    /**
     * This handler reads all active jobAds
     * @returns SimpleJobAd[] - all jobAds with coverImage
     */
    readActive: defineOperation({
        authorizer: () => jobAdAuthers.readActive.dynamicFields({}),
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
        authorizer: () => jobAdAuthers.readInactivePage.dynamicFields({}),
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
        authorizer: () => jobAdAuthers.update.dynamicFields({}),
        operation: async ({ prisma, params: { id }, data }) => await prisma.jobAd.update({
            where: { id },
            data,
        })
    }),
    destroy: defineOperation({
        paramsSchema: z.object({
            id: z.number(),
        }),
        authorizer: () => jobAdAuthers.destroy.dynamicFields({}),
        operation: async ({ prisma, params: { id } }) => {
            const jobAd = await prisma.jobAd.delete({
                where: { id },
            })
            await destroyArticle(jobAd.articleId)
        }
    }),
}
