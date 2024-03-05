'use server'
import prisma from '@/prisma'
import { createPrismaActionError } from '@/actions/error'
import type { ActionReturn } from '@/actions/Types'
import type { Article } from '@prisma/client'

export async function destroyArticle(id: number): Promise<ActionReturn<Article>> {
    try {
        const article = await prisma.article.delete({
            where: { id }
        })

        // delete coverimage
        await prisma.cmsImage.delete({
            where: { id: article.coverImageId }
        })

        return {
            success: true,
            data: article
        }
    } catch (error) {
        return createPrismaActionError(error)
    }
}
