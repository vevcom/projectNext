import 'server-only'
import { updateCmsLinkSchema } from './schema'
import prisma from '@/prisma'
import { prismaCall } from '@/server/prismaCall'
import type { UpdateCmsLinkType } from './schema'
import type { CmsLink } from '@prisma/client'

export async function updateCmsLink(
    id: number,
    rawData: UpdateCmsLinkType,
): Promise<CmsLink> {
    const data = updateCmsLinkSchema.detailedValidate(rawData)

    return await prismaCall(() => prisma.cmsLink.update({
        where: { id },
        data,
    }))
}
