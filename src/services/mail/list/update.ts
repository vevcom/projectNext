import '@pn-server-only'
import { updateMailingListValidation } from './validation'
import { prismaCall } from '@/services/prismaCall'
import { prisma } from '@/prisma-pn-client-instance'
import type { UpdateMailingListTypes } from './validation'
import type { MailingList } from '@/prisma-generated-pn-types'


export async function updateMailingList(data: UpdateMailingListTypes['Detailed']):
Promise<MailingList> {
    const parse = updateMailingListValidation.detailedValidate(data)

    return await prismaCall(() => prisma.mailingList.update({
        where: {
            id: parse.id,
        },
        data: {
            name: parse.name,
            description: parse.description,
        },
    }))
}
