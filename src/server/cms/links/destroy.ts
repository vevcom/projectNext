import 'server-only'
import prisma from '@/prisma'
import { prismaCall } from '@/server/prismaCall'
import type { CmsLink } from '@prisma/client'

export async function destroyCmsLink(id: number): Promise<CmsLink> {
    return await prismaCall(() => prisma.cmsLink.delete({
        where: { id },
    }))
}
