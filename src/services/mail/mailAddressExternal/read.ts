import '@pn-server-only'
import { prismaCall } from '@/services/prismaCall'
import { prisma } from '@/prisma-pn-client-instance'
import type { MailAddressExternal } from '@/prisma-generated-pn-types'


export async function readMailAddressExternal(): Promise<MailAddressExternal[]> {
    return await prismaCall(() => prisma.mailAddressExternal.findMany())
}
