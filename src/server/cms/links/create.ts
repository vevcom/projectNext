import 'server-only'
import prisma from '@/prisma'
import { prismaCall } from '@/server/prismaCall'
import type { CmsLink } from '@prisma/client'

export async function createCmsLink(name: string): Promise<CmsLink> {
    return await prismaCall(() => prisma.cmsLink.create({
        data: {
            name
        }
    }))
}
