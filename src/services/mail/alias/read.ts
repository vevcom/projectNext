import '@pn-server-only'
import { prismaCall } from '@/services/prismaCall'
import { prisma } from '@/prisma/client'
import type { MailAlias } from '@prisma/client'


export async function readMailAliases(): Promise<MailAlias[]> {
    return await prismaCall(() => prisma.mailAlias.findMany())
}
