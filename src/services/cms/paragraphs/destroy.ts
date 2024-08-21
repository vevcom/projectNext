import 'server-only'
import prisma from '@/prisma'
import { prismaCall } from '@/services/prismaCall'
import type { CmsParagraph } from '@prisma/client'

export async function destroyCmsParagraph(id: number): Promise<CmsParagraph> {
    return await prismaCall(() => prisma.cmsParagraph.delete({
        where: { id },
    }))
}
