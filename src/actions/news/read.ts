'use server'
import prisma from '@/prisma'
import errorHandler from '@/prisma/errorHandler'
import type { ReturnType } from './ReturnType'
import type { NewsArticle } from '@prisma/client'
import type { ActionReturn } from '@/actions/type'

type SimpleReturnTypeReadMany = NewsArticle & { name: string } //the name is connected to article not newsarticle
export async function readNews(): Promise<ActionReturn<SimpleReturnTypeReadMany[]>> {
    try {
        const news = await prisma.newsArticle.findMany({
            include: {
                article: {
                    select: {
                        name: true
                    }
                }
            }
        })
        return {
            success: true, 
            data: news.map(n => ({
                ...n,
                name: n.article.name
            }))
        }
    } catch (error) {
        return errorHandler(error)
    }
}