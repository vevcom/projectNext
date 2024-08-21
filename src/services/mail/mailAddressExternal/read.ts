import 'server-only'
import { prismaCall } from '@/services/prismaCall'
import prisma from '@/prisma'
import type { MailAddressExternal } from '@prisma/client'


export async function readMailAddressExternal(): Promise<MailAddressExternal[]> {
    return await prismaCall(() => prisma.mailAddressExternal.findMany())
}
