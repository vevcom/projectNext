import 'server-only'
import { prismaCall } from '@/server/prismaCall'
import prisma from '@/prisma'
import type { MailAlias } from '@prisma/client'


export async function readMailAliases(): Promise<MailAlias[]> {
    return await prismaCall(() => prisma.mailAlias.findMany())
}
