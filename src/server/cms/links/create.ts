import 'server-only'
import prisma from '@/prisma'
import type { CmsLink } from '@prisma/client'
import { prismaCall } from '@/server/prismaCall'

export async function createCmsLink(name: string): Promise<CmsLink> {
    return await prismaCall(() => prisma.cmsLink.create({
        data: {
            name
        }
    }))
}
