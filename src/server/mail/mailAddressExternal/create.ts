import 'server-only'
import { createMailAddressExternalValidation, type CreateMailAddressExternalTypes } from './validation'
import { prismaCall } from '@/server/prismaCall'
import prisma from '@/prisma'
import type { MailAddressExternal } from '@prisma/client'

export async function createMailAddressExternal(rawdata: CreateMailAddressExternalTypes['Detailed']):
    Promise<MailAddressExternal> {
    const parsedData = createMailAddressExternalValidation.detailedValidate(rawdata)

    return await prismaCall(() => prisma.mailAddressExternal.create({
        data: parsedData,
    }))
}
