import '@pn-server-only'
import { createMailingListValidation, type CreateMailingListTypes } from './validation'
import { prismaCall } from '@/services/prismaCall'
import { prisma } from '@/prisma/client'
import type { MailingList } from '@prisma/client'

export async function createMailingList(rawdata: CreateMailingListTypes['Detailed']):
    Promise<MailingList> {
    const parsedData = createMailingListValidation.detailedValidate(rawdata)

    return await prismaCall(() => prisma.mailingList.create({
        data: parsedData,
    }))
}
