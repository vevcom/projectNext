import 'server-only'
import { screenPageIncluder } from './ConfigVars'
import { prismaCall } from '@/server/prismaCall'
import prisma from '@/prisma'
import type { ExpandedScreenPage } from './Types'

export async function readPage(id: number): Promise<ExpandedScreenPage> {
    return await prismaCall(() => prisma.screenPage.findUniqueOrThrow({
        where: { id },
        include: screenPageIncluder
    }))
}
