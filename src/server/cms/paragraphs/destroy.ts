import 'server-only'
import prisma from '@/prisma'
import type { CmsParagraph } from '@prisma/client'
import { prismaCall } from '@/server/prismaCall'

export async function destroyCmsParagraph(id: number): Promise<CmsParagraph> {
    return await prismaCall(() => prisma.cmsParagraph.delete({
        where: { id },
    }))
}
