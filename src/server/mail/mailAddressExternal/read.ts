import 'server-only'
import { prismaCall } from '@/server/prismaCall'
import prisma from '@/prisma'
import type { MailAddressExternal } from '@prisma/client'


export async function readAllMailAddressExternal(): Promise<MailAddressExternal[]> {
    return await prismaCall(() => prisma.mailAddressExternal.findMany())
}
