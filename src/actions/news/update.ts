'use server'
import newsArticleSchema from './schema'
import prisma from '@/prisma'
import errorHandler from '@/prisma/errorHandler'
import type { SimpleNewsArticle } from './Types'
import type { ActionReturn } from '@/actions/Types'

export async function publishNews(
    id: number,
    shouldPublish: boolean
): Promise<ActionReturn<Omit<SimpleNewsArticle, 'coverImage'>>> {
    try {
        const news = await prisma.newsArticle.update({
            where: { id },
            data: {},
            //data: { published: shouldPublish } //TODO: add published field to news
        })
        return {
            success: true,
            data: news
        }
    } catch (error) {
        return errorHandler(error)
    }
}

export async function updateNews(
    id: number,
    rawdata: FormData
): Promise<ActionReturn<Omit<SimpleNewsArticle, 'coverImage'>>> {
    try {
        const parse = newsArticleSchema.safeParse(Object.fromEntries(rawdata.entries()))
        if (!parse.success) {
            return { success: false, error: parse.error.issues }
        }
        const data = parse.data
        const news = await prisma.newsArticle.update({
            where: { id },
            data: {
                description: data.description,
                article: {
                    update: {
                        name: data.name
                    }
                },
                endDateTime: data.endDateTime || undefined,
            }
        })
        return {
            success: true,
            data: news
        }
    } catch (error) {
        return errorHandler(error)
    }
}

export async function updateVisibility(id: number, visible: unknown): Promise<ActionReturn<unknown>> {
    //TODO: add visible field to news
    return { success: false, error: [{ message: 'Not implemented' }] }
}
