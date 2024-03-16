import 'server-only'
import { createPrismaActionError } from '@/actions/error'
import prisma from '@/prisma'
import type { ActionReturn } from '@/actions/Types'
import type { CmsLink } from '@prisma/client'

export async function destroyCmsLink(id: number): Promise<ActionReturn<CmsLink>> {
    try {
        const cmsImage = await prisma.cmsLink.delete({
            where: { id },
        })
        return { success: true, data: cmsImage }
    } catch (error) {
        return createPrismaActionError(error)
    }
}
