import { updateScreenValidation } from './validation'
import { readScreen } from './read'
import { ServerError } from '@/server/error'
import { prismaCall } from '@/server/prismaCall'
import prisma from '@/prisma'
import type { ScreenPageMoveDirection } from './Types'
import type { UpdateScreenTypes } from './validation'
import type { Screen } from '@prisma/client'

export async function updateScreen(id: number, rawdata: UpdateScreenTypes['Detailed']): Promise<Screen> {
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
    if (!connectToPages) return readScreen(id)
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
    const highestOrder = await getHeighstOrder(id)
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
    return await readScreen(id)
}

async function getHeighstOrder(id: number): Promise<number> {
    const screen = await prismaCall(() => prisma.screen.findUniqueOrThrow({
        where: { id },
        include: {
            screenPageScreen: true
        }
    }))
    return Math.max(...screen.screenPageScreen.map(sps => sps.order))
}

export async function movePageInScreen(
    id: {screen: number, page: number},
    direction: ScreenPageMoveDirection
): Promise<void> {
    const screenPageScreen1 = await prismaCall(() => prisma.screenPageScreen.findUniqueOrThrow({
        where: { screenPageId_screenId: { screenId: id.screen, screenPageId: id.page } }
    }))
    const screenPageScreen2 = await prismaCall(() => prisma.screenPageScreen.findFirst({
        where: {
            screenId: screenPageScreen1.screenId,
            order: direction === 'UP' ? {
                lt: screenPageScreen1.order
            } : {
                gt: screenPageScreen1.order
            }
        },
        orderBy: {
            order: direction === 'UP' ? 'desc' : 'asc'
        }
    }))
    if (!screenPageScreen2) throw new ServerError('BAD PARAMETERS', 'Du kan ikke flytte denne lengre')
    const heighstOrder = await getHeighstOrder(id.screen)
    await prismaCall(() => prisma.screenPageScreen.update({
        where: { screenPageId_screenId: { screenId: id.screen, screenPageId: id.page } },
        data: {
            order: heighstOrder + 1
        }
    }))
    await prismaCall(() => prisma.screenPageScreen.update({
        where: {
            screenPageId_screenId: {
                screenId: screenPageScreen2.screenId,
                screenPageId: screenPageScreen2.screenPageId
            }
        },
        data: {
            order: screenPageScreen1.order
        }
    }))
    await prismaCall(() => prisma.screenPageScreen.update({
        where: { screenPageId_screenId: { screenId: id.screen, screenPageId: id.page } },
        data: {
            order: screenPageScreen2.order
        }
    }))
}
