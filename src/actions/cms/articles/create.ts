'use server'
import { ActionReturn } from '@/actions/type'
import { ReturnType } from './ReturnType'
import prisma from '@/prisma'
import errorHandeler from '@/prisma/errorHandler'

export default async function create(name: string): Promise<ActionReturn<ReturnType>> {
    try {
        const article = await prisma.article.create({
            data: {
                name,
                coverImage: {
                    create: {
                        name: `${name}_cover`,
                    }
                },
            },
            include: {
                articleSections: {
                    include: {
                        cmsImage: true,
                        cmsParagraph: true,
                        cmsLink: true
                    }
                },
                coverImage: true,
            }
        })
        return { success: true, data: article }
    } catch (error) {
        return errorHandeler(error)
    }
}