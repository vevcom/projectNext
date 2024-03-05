'use server'
import schema from './schema'
import { defaultNewsArticleOldCutoff } from './ConfigVars'
import prisma from '@/prisma'
import { readCurrenOmegaOrder } from '@/actions/omegaOrder/read'
import { createArticle } from '@/cms/articles/create'
import { createPrismaActionError, createZodActionError } from '@/actions/error'
import type { ActionReturn } from '@/actions/Types'
import type { ExpandedNewsArticle } from './Types'

export async function createNews(rawdata: FormData): Promise<ActionReturn<ExpandedNewsArticle>> {
    //TODO: check for can create news permission
    const endDateTime = new Date()
    endDateTime.setDate(endDateTime.getDate() + defaultNewsArticleOldCutoff)

    const parse = schema.safeParse(Object.fromEntries(rawdata.entries()))
    if (!parse.success) {
        return createZodActionError(parse)
    }
    const data = parse.data

    const res = await readCurrenOmegaOrder()
    if (!res.success) return res
    const orderPublished = res.data.order

    try {
        const article = await createArticle(data.name)
        if (!article.success) {
            return article
        }
        const news = await prisma.newsArticle.create({
            data: {
                description: data.description,
                article: {
                    connect: {
                        id: article.data.id
                    }
                },
                endDateTime: data.endDateTime || endDateTime,
                orderPublished,
            },
            include: {
                article: {
                    include: {
                        coverImage: true,
                        articleSections: {
                            include: {
                                cmsImage: true,
                                cmsParagraph: true,
                                cmsLink: true
                            }
                        }
                    }
                }
            }
        })
        return { success: true, data: news }
    } catch (error) {
        return createPrismaActionError(error)
    }
}
