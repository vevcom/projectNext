import '@pn-server-only'
import { createMailAddressExternalValidation, type CreateMailAddressExternalTypes } from './validation'
import { prismaCall } from '@/services/prismaCall'
import { prisma } from '@/prisma/client'
import type { MailAddressExternal } from '@prisma/client'

export async function createMailAddressExternal(rawdata: CreateMailAddressExternalTypes['Detailed']):
    Promise<MailAddressExternal> {
    const parsedData = createMailAddressExternalValidation.detailedValidate(rawdata)

    return await prismaCall(() => prisma.mailAddressExternal.create({
        data: parsedData,
    }))
}
