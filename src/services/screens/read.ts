import { screenPageIncluder } from './pages/ConfigVars'
import { prismaCall } from '@/services/prismaCall'
import { prisma } from '@/prisma-pn-client-instance'
import type { ExpandedScreen } from './types'
import type { Screen } from '@/prisma-generated-pn-types'

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

