import prisma from "@/prisma"
import { prismaCall } from "@/server/prismaCall"

export async function destroyPage(id: number) : Promise<void> {
    const page = await prismaCall(() => prisma.screenPage.delete({
        where: { id }
    }))
    if (page.cmsImageId)
        await prisma.cmsImage.deleteMany({
            where: { id: page.cmsImageId }
        })
    if (page.cmsParagraphId)
        await prisma.cmsParagraph.deleteMany({
            where: { id: page.cmsParagraphId }
        })
}