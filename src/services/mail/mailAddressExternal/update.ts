import '@pn-server-only'
import { updateMailAddressExternalValidation } from './validation'
import { prismaCall } from '@/services/prismaCall'
import prisma from '@/prisma'
import type { MailAddressExternal } from '@prisma/client'
import type { UpdatemailAddressExternalTypes } from './validation'


export async function updateMailAddressExternal(data: UpdatemailAddressExternalTypes['Detailed']):
Promise<MailAddressExternal> {
    const parse = updateMailAddressExternalValidation.detailedValidate(data)

    return await prismaCall(() => prisma.mailAddressExternal.update({
        where: {
            id: parse.id,
        },
        data: {
            address: parse.address,
            description: parse.description,
        },
    }))
}
