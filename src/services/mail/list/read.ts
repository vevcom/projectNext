import '@pn-server-only'

import { prismaCall } from '@/services/prismaCall'
import { prisma } from '@/prisma-pn-client-instance'
import type { MailingList } from '@/prisma-generated-pn-types'

export async function readMailingLists(): Promise<MailingList[]> {
    return await prismaCall(() => prisma.mailingList.findMany())
}
