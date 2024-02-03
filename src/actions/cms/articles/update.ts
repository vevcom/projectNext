'use server'
import prisma from '@/prisma'
import errorHandler from '@/prisma/errorHandler'
import { ActionReturn } from '@/actions/type'
import type { ReturnType } from './ReturnType'

export default async function update(id: number, config: {
    name?: string,
}) : Promise<ActionReturn<ReturnType>> {
    try {
        const article = await prisma.article.update({
            where: {
                id,
            },
            data: {
                ...config,
            },
            include: {
                coverImage: true,
                articleSections: {
                    include: {
                        cmsImage: true,
                        cmsParagraph: true,
                        cmsLink: true,
                    }
                }
            }
        })
        return { success: true, data: article }
    } catch (error) {
        return errorHandler(error)
    }
}
