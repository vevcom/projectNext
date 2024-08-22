import 'server-only'
import prisma from '@/prisma'
import { prismaCall } from '@/server/prismaCall'
import { updatePageValidation } from '@/server/screens/pages/validation'
import type { UpdatePageTypes } from '@/server/screens/pages/validation'
import type { ScreenPage } from '@prisma/client'

export async function updatePage(id: number, rawdata: UpdatePageTypes['Detailed']): Promise<ScreenPage> {
    const data = updatePageValidation.detailedValidate(rawdata)

    return await prismaCall(() => prisma.screenPage.update({
        where: { id },
        data,
    }))
}
