import '@pn-server-only'

import { prismaCall } from '@/services/prismaCall'
import { prisma } from '@/prisma/client'
import type { MailingList } from '@prisma/client'

export async function readMailingLists(): Promise<MailingList[]> {
    return await prismaCall(() => prisma.mailingList.findMany())
}
