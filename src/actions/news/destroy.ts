'use server'
import { destroyArticle } from '@/cms/articles/destroy'
import prisma from '@/prisma'
import errorHandler from '@/prisma/errorHandler'
import type { ActionReturn } from '@/actions/type'
import type { SimpleReturnType } from './ReturnType'

export async function destroyNews(id: number): Promise<ActionReturn<Omit<SimpleReturnType, 'coverImage'>>> {
    try {
        // destroying an news article also destroys the cover image, and all cms parts!
        const news = await prisma.newsArticle.delete({
            where: { id }
        })

        return {
            success: true,
            data: news
        }
    } catch (error) {
        return errorHandler(error)
    }
}
