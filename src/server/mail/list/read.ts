import 'server-only'

import { prismaCall } from '@/server/prismaCall'
import prisma from '@/prisma'
import type { MailingList } from '@prisma/client'

export async function readMailingLists(): Promise<MailingList[]> {
    return await prismaCall(() => prisma.mailingList.findMany())
}
