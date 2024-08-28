import 'server-only'
import prisma from '@/prisma'
import { prismaCall } from '@/services/prismaCall'

export async function destroyPage(id: number): Promise<void> {
    const page = await prismaCall(() => prisma.screenPage.delete({
        where: { id }
    }))
    await prisma.cmsImage.delete({
        where: { id: page.cmsImageId }
    })
    await prisma.cmsParagraph.delete({
        where: { id: page.cmsParagraphId }
    })
}
