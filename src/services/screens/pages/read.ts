import '@pn-server-only'
import { screenPageIncluder } from './ConfigVars'
import { prismaCall } from '@/services/prismaCall'
import { prisma } from '@/prisma/client'
import type { ScreenPage } from '@prisma/client'
import type { ExpandedScreenPage } from './Types'

export async function readPage(id: number): Promise<ExpandedScreenPage> {
    return await prismaCall(() => prisma.screenPage.findUniqueOrThrow({
        where: { id },
        include: screenPageIncluder
    }))
}

export async function readPages(): Promise<ScreenPage[]> {
    return await prismaCall(() => prisma.screenPage.findMany())
}
