import 'server-only'
import { createCmsLinkSchema } from './schema'
import prisma from '@/prisma'
import { prismaCall } from '@/server/prismaCall'
import type { CreateCmsLinkType } from './schema'
import type { CmsLink } from '@prisma/client'

export async function createCmsLink(rawData: CreateCmsLinkType): Promise<CmsLink> {
    const data = createCmsLinkSchema.detailedValidate(rawData)

    return await prismaCall(() => prisma.cmsLink.create({
        data,
    }))
}
