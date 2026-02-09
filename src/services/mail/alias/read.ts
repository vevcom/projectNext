import '@pn-server-only'
import { prismaCall } from '@/services/prismaCall'
import { prisma } from '@/prisma-pn-client-instance'
import type { MailAlias } from '@/prisma-generated-pn-types'


export async function readMailAliases(): Promise<MailAlias[]> {
    return await prismaCall(() => prisma.mailAlias.findMany())
}
