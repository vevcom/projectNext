import { type CreatePageTypes, createPageValidation } from './validation'
import { prismaCall } from '@/server/prismaCall'
import prisma from '@/prisma'
import type { ScreenPage } from '@prisma/client'

export async function createPage(rawdata: CreatePageTypes['Detailed']): Promise<ScreenPage> {
    const { name } = createPageValidation.detailedValidate(rawdata)
    return await prismaCall(() => prisma.screenPage.create({
        data: {
            name,
            type: 'TEXT_AND_IMAGE',
        },
    }))
}
