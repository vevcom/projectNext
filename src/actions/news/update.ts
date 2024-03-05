'use server'
import newsArticleSchema from './schema'
import prisma from '@/prisma'
import { createActionError, createPrismaActionError, createZodActionError } from '@/actions/error'
import type { SimpleNewsArticle } from './Types'
import type { ActionReturn } from '@/actions/Types'

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
        return createPrismaActionError(error)
    }
}

export async function updateNews(
    id: number,
    rawdata: FormData
): Promise<ActionReturn<Omit<SimpleNewsArticle, 'coverImage'>>> {
    try {
        const parse = newsArticleSchema.safeParse(Object.fromEntries(rawdata.entries()))
        if (!parse.success) {
            return createZodActionError(parse)
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
        return createPrismaActionError(error)
    }
}

// disable eslint rule temporarily until todo is resolved
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function updateVisibility(id: number, visible: unknown): Promise<ActionReturn<unknown>> {
    //TODO: add visible field to news
    return createActionError('UNKNOWN ERROR', 'Not implemented')
}
