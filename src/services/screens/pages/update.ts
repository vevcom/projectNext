import '@pn-server-only'
import { prisma } from '@/prisma-pn-client-instance'
import { prismaCall } from '@/services/prismaCall'
import { updatePageValidation } from '@/services/screens/pages/validation'
import type { UpdatePageTypes } from '@/services/screens/pages/validation'
import type { ScreenPage } from '@/prisma-generated-pn-types'

export async function updatePage(
    id: number,
    rawdata: UpdatePageTypes['Detailed']
): Promise<ScreenPage> {
    const { connectToJobAd, ...data } = updatePageValidation.detailedValidate(rawdata)

    return await prismaCall(() => prisma.screenPage.update({
        where: { id },
        data: {
            ...data,
            jobAd: connectToJobAd ? { connect: { id: connectToJobAd } } : undefined,
        }
    }))
}
