import '@pn-server-only'
import { screenPageIncluder } from './ConfigVars'
import { prismaCall } from '@/services/prismaCall'
import { prisma } from '@/prisma-pn-client-instance'
import type { ScreenPage } from '@/prisma-generated-pn-types'
import type { ExpandedScreenPage } from './types'

export async function readPage(id: number): Promise<ExpandedScreenPage> {
    return await prismaCall(() => prisma.screenPage.findUniqueOrThrow({
        where: { id },
        include: screenPageIncluder
    }))
}

export async function readPages(): Promise<ScreenPage[]> {
    return await prismaCall(() => prisma.screenPage.findMany())
}
