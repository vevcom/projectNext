'use server'
import create from './create'
import { ActionReturn } from '@/actions/type'
import prisma from '@/prisma'
import errorHandeler from '@/prisma/errorHandler'
import type { ReturnType } from './ReturnType'

// Note that this function creates a new articleSection if it doesn't exist
export default async function read(name: string): Promise<ActionReturn<ReturnType>> {
    try {
        const articleSection = await prisma.articleSection.findUnique({
            where: {
                name
            },
            include: {
                cmsImage: true,
                cmsParagraph: true,
                cmsLink: true
            }
        })
        if (articleSection) return { success: true, data: articleSection }
        const createRes = await create(name)
        return createRes
    } catch (error) {
        return errorHandeler(error)
    }
}
