'use server'
import { schema } from './schema'
import prisma from '@/prisma'
import errorHandler from '@/prisma/errorHandler'
import type { SimpleReturnType } from './ReturnType'
import type { ActionReturn } from '@/actions/type'

export async function publishNews(
    id: number,
    shouldPublish: boolean
): Promise<ActionReturn<Omit<SimpleReturnType, 'coverImage'>>> {
    console.log(id, shouldPublish)
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
): Promise<ActionReturn<Omit<SimpleReturnType, 'coverImage'>>> {
    try {
        const parse = schema.safeParse(Object.fromEntries(rawdata.entries()))
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
                }
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
    console.log(id, visible)
    return { success: false, error: [{ message: 'Not implemented' }] }
}
