import 'server-only'
import prisma from '@/prisma'
import { createPrismaActionError, createZodActionError } from '@/actions/error'
import type { CmsLink, Prisma } from '@prisma/client'
import type { ActionReturn } from '@/actions/Types'

export async function updateCmsLink(
    id: number, 
    data: Prisma.CmsLinkUpdateInput
): Promise<ActionReturn<CmsLink>> {
    try {
        const cmsLink = await prisma.cmsLink.update({
            where: { id },
            data,
        })
        return { success: true, data: cmsLink }
    } catch (error) {
        return createPrismaActionError(error)
    }
}