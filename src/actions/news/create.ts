'use server'
import schema from '@/cms/articleCategories/schema'
import prisma from '@/prisma'
import { createArticle } from '@/cms/articles/create'
import errorHandler from '@/prisma/errorHandler'
import type { ActionReturn } from '@/actions/type'
import type { ReturnType } from './ReturnType'

export async function createNews(rawdata: FormData): Promise<ActionReturn<ReturnType>> {
    //TODO: check for can create news permission
    const parse = schema.safeParse(Object.fromEntries(rawdata.entries()))
    if (!parse.success) {
        return { success: false, error: parse.error.issues }
    }
    const data = parse.data
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
                }
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
        return errorHandler(error)
    }
}
