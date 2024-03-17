import 'server-only'
import prisma from '@/prisma'
import type { CmsLink } from '@prisma/client'
import { prismaCall } from '@/server/prismaCall'

export async function destroyCmsLink(id: number): Promise<CmsLink> {
    return await prismaCall(() => prisma.cmsLink.delete({
        where: { id },
    }))
}
