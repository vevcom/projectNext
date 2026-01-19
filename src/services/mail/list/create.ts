import '@pn-server-only'
import { createMailingListValidation, type CreateMailingListTypes } from './validation'
import { prismaCall } from '@/services/prismaCall'
import { prisma } from '@/prisma-pn-client-instance'
import type { MailingList } from '@/prisma-generated-pn-types'

export async function createMailingList(rawdata: CreateMailingListTypes['Detailed']):
    Promise<MailingList> {
    const parsedData = createMailingListValidation.detailedValidate(rawdata)

    return await prismaCall(() => prisma.mailingList.create({
        data: parsedData,
    }))
}
