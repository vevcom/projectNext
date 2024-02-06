'use server'
import { ActionReturn } from '@/actions/type'
import errorHandler from '@/prisma/errorHandler'
import prisma from '@/prisma'
import type { CmsLink } from '@prisma/client'

export async function createCmsLink(name: string): Promise<ActionReturn<CmsLink>> {
    try {
        const cmsLink = await prisma.cmsLink.create({
            data: {
                name
            }
        })
        return { success: true, data: cmsLink }
    } catch (error) {
        return errorHandler(error)
    }
}
