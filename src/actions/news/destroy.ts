'use server'
import { SimpleReturnType } from "./ReturnType"
import { ActionReturn } from '@/actions/type'
import prisma from '@/prisma'
import errorHandler from '@/prisma/errorHandler'
import { destroyArticle } from "../cms/articles/destroy"

export async function destroyNews(id: number) : Promise<ActionReturn<Omit<SimpleReturnType, 'coverImage'>>> {
    try {
        // destroy article relationg to news to make sure all parts are destroyed properly
        const news = await prisma.newsArticle.findUnique({
            where: { id }
        })
        if (!news) throw new Error('News not found')
        if (news.articleId) await destroyArticle(news.articleId)
        // this will destroy the newsArticle on cascade

        return { 
            success: true, 
            data: news
        }
    } catch (error) {
        return errorHandler(error)
    }
}