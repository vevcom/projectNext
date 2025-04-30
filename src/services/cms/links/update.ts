import '@pn-server-only'
import { updateCmsLinkValidation } from './validation'
import prisma from '@/prisma'
import { prismaCall } from '@/services/prismaCall'
import type { UpdateCmsLinkTypes } from './validation'
import type { CmsLink } from '@prisma/client'

export async function updateCmsLink(
    id: number,
    rawData: UpdateCmsLinkTypes['Detailed'],
): Promise<CmsLink> {
    const data = updateCmsLinkValidation.detailedValidate(rawData)
    data.url ??= './'
    return await prismaCall(() => prisma.cmsLink.update({
        where: { id },
        data,
    }))
}
