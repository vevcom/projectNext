'use server'
import { newsArticleSchema } from './schema'
import prisma from '@/prisma'
import { createActionError, createPrismaActionError, createZodActionError } from '@/actions/error'
import type { SimpleNewsArticle } from '@/server/news/Types'
import type { ActionReturn } from '@/actions/Types'
import type { NewsArticleSchemaType } from './schema'
import { updateNews } from '@/server/news/update'


export async function updateNewsAction(
    id: number,
    rawdata: FormData | NewsArticleSchemaType
): Promise<ActionReturn<Omit<SimpleNewsArticle, 'coverImage'>>> {
    //TODO: auth 
    const parse = newsArticleSchema.safeParse(rawdata)
    if (!parse.success) return createZodActionError(parse)
    const data = parse.data
    return await updateNews(id, data) 
}

export async function publishNewsAction(
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


// disable eslint rule temporarily until todo is resolved
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function updateVisibilityAction(id: number, visible: unknown): Promise<ActionReturn<unknown>> {
    //TODO: add visible field to news
    return createActionError('UNKNOWN ERROR', 'Not implemented')
}
