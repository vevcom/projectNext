import '@pn-server-only'
import { updateMailingListValidation } from './validation'
import { prismaCall } from '@/services/prismaCall'
import { prisma } from '@/prisma/client'
import type { UpdateMailingListTypes } from './validation'
import type { MailingList } from '@prisma/client'


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
