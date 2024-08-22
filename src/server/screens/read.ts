import { screenPageIncluder } from './pages/ConfigVars'
import { prismaCall } from '@/server/prismaCall'
import prisma from '@/prisma'
import type { ExpandedScreen } from './Types'
import type { Screen } from '@prisma/client'

export async function readScreen(id: number): Promise<ExpandedScreen> {
    const screen = await prismaCall(() => prisma.screen.findUniqueOrThrow({
        where: { id },
        include: {
            screenPageScreen: {
                include: {
                    screenPage: {
                        include: screenPageIncluder
                    },
                },
            },
        }
    }))
    return {
        ...screen,
        pages: screen.screenPageScreen.map((sps) => sps.screenPage)
    }
}

export async function readScreens(): Promise<Screen[]> {
    return await prismaCall(() => prisma.screen.findMany())
}

