'use server'
import prisma from '@/prisma'
import errorHandler from '@/prisma/errorHandler'
import { ActionReturn } from '@/actions/type'
import { ArticleSection } from '@prisma/client'

export default async function destroy(name: string) : Promise<ActionReturn<ArticleSection>> {
    try {
        const articleSection = await prisma.articleSection.delete({
            where: { name },
        })
        return { success: true, data: articleSection }
    } catch (error) {
        return errorHandler(error)
    }
}