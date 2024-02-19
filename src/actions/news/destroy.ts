'use server'
import { SimpleReturnType } from "./ReturnType"
import { ActionReturn } from '@/actions/type'
import prisma from '@/prisma'
import errorHandler from '@/prisma/errorHandler'

export async function destroyNews(id: number) : Promise<ActionReturn<Omit<SimpleReturnType, 'coverImage'>>> {
    try {
        const news = await prisma.newsArticle.delete({
            where: { id }
        })
        await prisma.article.delete({
            where: { id: news.articleId }
        })
        return { 
            success: true, 
            data: news
        }
    } catch (error) {
        return errorHandler(error)
    }
}