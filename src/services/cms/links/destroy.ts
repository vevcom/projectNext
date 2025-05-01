import '@pn-server-only'
import prisma from '@/prisma'
import { prismaCall } from '@/services/prismaCall'
import type { CmsLink } from '@prisma/client'

export async function destroyCmsLink(id: number): Promise<CmsLink> {
    return await prismaCall(() => prisma.cmsLink.delete({
        where: { id },
    }))
}
