import '@pn-server-only'
import { type CreatePageTypes, createPageValidation } from './validation'
import { prismaCall } from '@/services/prismaCall'
import { prisma } from '@/prisma-pn-client-instance'
import { cmsImageOperations } from '@/services/cms/images/operations'
import { cmsParagraphOperations } from '@/cms/paragraphs/operations'
import type { ScreenPage } from '@/prisma-generated-pn-types'

export async function createPage(rawdata: CreatePageTypes['Detailed']): Promise<ScreenPage> {
    const { name } = createPageValidation.detailedValidate(rawdata)
    const cmsImage = await cmsImageOperations.create.internalCall({ data: {} })
    const cmsParagraph = await cmsParagraphOperations.create.internalCall({ data: {} })

    return await prismaCall(() => prisma.screenPage.create({
        data: {
            name,
            type: 'TEXT_AND_IMAGE',
            cmsImage: { connect: { id: cmsImage.id } },
            cmsParagraph: { connect: { id: cmsParagraph.id } },
        },
    }))
}
