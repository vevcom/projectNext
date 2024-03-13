'use server'
import prisma from '@/prisma'
import { createPrismaActionError } from '@/actions/error'
import type { ActionReturn } from '@/actions/Types'
import type { Article } from '@prisma/client'
import { destroyArticle } from '@/server/cms/articles/destroy'

export async function destroyArticleAction(id: number): Promise<ActionReturn<Article>> {
    //TODO: auth
    return await destroyArticle(id)
}
