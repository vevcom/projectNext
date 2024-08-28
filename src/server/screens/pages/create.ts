import 'server-only'
import { type CreatePageTypes, createPageValidation } from './validation'
import { prismaCall } from '@/server/prismaCall'
import prisma from '@/prisma'
import { createCmsImage } from '@/server/cms/images/create'
import { createCmsParagraph } from '@/server/cms/paragraphs/create'
import { v4 } from 'uuid'
import type { ScreenPage } from '@prisma/client'

export async function createPage(rawdata: CreatePageTypes['Detailed']): Promise<ScreenPage> {
    const { name } = createPageValidation.detailedValidate(rawdata)
    const cmsImage = await createCmsImage({ name: v4() })
    const cmsParagraph = await createCmsParagraph({ name: v4() })

    return await prismaCall(() => prisma.screenPage.create({
        data: {
            name,
            type: 'TEXT_AND_IMAGE',
            cmsImage: { connect: { id: cmsImage.id } },
            cmsParagraph: { connect: { id: cmsParagraph.id } },
        },
    }))
}
