'use server'
import { createPrismaActionError } from '@/actions/error'
import prisma from '@/prisma'
import type { ActionReturn } from '@/actions/Types'
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
        return createPrismaActionError(error)
    }
}
