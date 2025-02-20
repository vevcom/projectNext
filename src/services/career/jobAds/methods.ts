import 'server-only'
import { jobAdSchemas } from './schemas'
import { jobAdAuthers } from './authers'
import { createArticle } from '@/services/cms/articles/create'
import { readCurrentOmegaOrder } from '@/services/omegaOrder/read'
import { ServiceMethod } from '@/services/ServiceMethod'
import { z } from 'zod'
import { ExpandedJobAd, SimpleJobAd } from './Types'
import { jobAdConfig } from './config'
import { companyConfig } from '../companies/ConfigVars'
import { ServerError } from '@/services/error'
import { readPageInputSchemaObject } from '@/lib/paging/schema'
import { JobType } from '@prisma/client'
import { cursorPageingSelection } from '@/lib/paging/cursorPageingSelection'
import { destroyArticle } from '@/services/cms/articles/destroy'

export const jobAdMethods = {
    create: ServiceMethod({
        dataSchema: jobAdSchemas.create,
        auther: () => jobAdAuthers.create.dynamicFields({}),
        method: async ({ prisma, data: { articleName, companyId, ...data } }) => {
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
    read: ServiceMethod({
        paramsSchema: z.object({
            idOrName: z.union([
                z.number(),
                z.object({
                    articleName: z.string(),
                    order: z.number(),
                }),
            ]),
        }),
        auther: () => jobAdAuthers.read.dynamicFields({}),
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
                    ...jobAdConfig.relationIncluder,
                    company: {
                        include: companyConfig.relationIncluder,
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
    readActive: ServiceMethod({
        auther: () => jobAdAuthers.readActive.dynamicFields({}),
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
                include: jobAdConfig.simpleRelationIncluder,
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
    readInactivePage: ServiceMethod({
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
        auther: () => jobAdAuthers.readInactivePage.dynamicFields({}),
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
                include: jobAdConfig.simpleRelationIncluder,
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
    update: ServiceMethod({
        paramsSchema: z.object({
            id: z.number(),
        }),
        dataSchema: jobAdSchemas.update,
        auther: () => jobAdAuthers.update.dynamicFields({}),
        method: async ({ prisma, params: { id }, data }) => await prisma.jobAd.update({
            where: { id },
            data,
        })
    }),
    destroy: ServiceMethod({
        paramsSchema: z.object({
            id: z.number(),
        }),
        auther: () => jobAdAuthers.destroy.dynamicFields({}),
        method: async ({ prisma, params: { id } }) => {
            const jobAd = await prisma.jobAd.delete({
                where: { id },
            })
            await destroyArticle(jobAd.articleId)
        }
    })

} as const