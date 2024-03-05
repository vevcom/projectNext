'use server'
import { newsArticleSchema } from './schema'
import prisma from '@/prisma'
import errorHandler from '@/prisma/errorHandler'
import type { SimpleNewsArticle } from './Types'
import type { ActionReturn } from '@/actions/Types'
import type { NewsArticleSchemaType } from './schema'

export async function publishNews(
    id: number,
    // disable eslint rule temporarily until todo is resolved
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
    rawdata: FormData | NewsArticleSchemaType
): Promise<ActionReturn<Omit<SimpleNewsArticle, 'coverImage'>>> {
    try {
        const parse = newsArticleSchema.safeParse(rawdata)
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

// disable eslint rule temporarily until todo is resolved
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function updateVisibility(id: number, visible: unknown): Promise<ActionReturn<unknown>> {
    //TODO: add visible field to news
    return { success: false, error: [{ message: 'Not implemented' }] }
}
