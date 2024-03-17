import 'server-only'
import prisma from '@/prisma'
import type { CmsLink, Prisma } from '@prisma/client'
import { prismaCall } from '@/server/prismaCall'

export async function updateCmsLink(
    id: number,
    data: Prisma.CmsLinkUpdateInput
): Promise<CmsLink> {
    return await prismaCall(() => prisma.cmsLink.update({
        where: { id },
        data,
    }))
}
