import { updateScreenValidation } from './validation'
import { prismaCall } from '@/server/prismaCall'
import prisma from '@/prisma'
import type { UpdateScreenTypes } from './validation'

export async function updateScreen(id: number, rawdata: UpdateScreenTypes['Detailed']): Promise<void> {
    const { orientation, name, connectToPages } = updateScreenValidation.detailedValidate(rawdata)
    const screen = await prismaCall(() => prisma.screen.update({
        where: { id },
        data: {
            orientation,
            name,
        },
        include: {
            screenPageScreen: true
        }
    }))
    const pagesToRemove = screen.screenPageScreen.filter(sps => !connectToPages.includes(sps.screenPageId))
    await prismaCall(() => prisma.screenPageScreen.deleteMany({
        where: {
            screenId: id,
            screenPageId: {
                in: pagesToRemove.map(sps => sps.screenPageId)
            }
        },
    }))
    //Get heighst order:
    const highestOrder = Math.max(...screen.screenPageScreen.map(sps => sps.order))
    let order = highestOrder + 1
    const pagesToAdd = connectToPages.filter(
        connectToId => !screen.screenPageScreen.some(sps => sps.screenPageId === connectToId)
    )
    await prismaCall(() => prisma.screenPageScreen.createMany({
        data: pagesToAdd.map(screenPageId => ({
            screenId: id,
            screenPageId,
            order: order++
        }))
    }))
}
