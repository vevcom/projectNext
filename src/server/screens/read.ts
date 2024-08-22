import { screenPageIncluder } from './pages/ConfigVars'
import { prismaCall } from '@/server/prismaCall'
import type { ExpandedScreen } from './Types'
import prisma from '@/prisma'

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
