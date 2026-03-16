import '@pn-server-only'
import { readMailingListValidation } from './validation'
import { prismaCall } from '@/services/prismaCall'
import { prisma } from '@/prisma-pn-client-instance'
import type { MailingList } from '@/prisma-generated-pn-types'


export async function destroyMailingList(id: number): Promise<MailingList> {
    const parse = readMailingListValidation.detailedValidate({ id })

    return await prismaCall(() => prisma.mailingList.delete({
        where: {
            id: parse.id,
        },
    }))
}
