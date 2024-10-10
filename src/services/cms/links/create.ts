import 'server-only'
import { createCmsLinkValidation } from './validation'
import prisma from '@/prisma'
import { prismaCall } from '@/services/prismaCall'
import type { CreateCmsLinkTypes } from './validation'
import type { CmsLink } from '@prisma/client'

export async function createCmsLink(rawData: CreateCmsLinkTypes['Detailed']): Promise<CmsLink> {
    const data = createCmsLinkValidation.detailedValidate(rawData)

    return await prismaCall(() => prisma.cmsLink.create({
        data,
    }))
}
