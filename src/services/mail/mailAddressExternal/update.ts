import '@pn-server-only'
import { updateMailAddressExternalValidation } from './validation'
import { prismaCall } from '@/services/prismaCall'
import { prisma } from '@/prisma-pn-client-instance'
import type { MailAddressExternal } from '@/prisma-generated-pn-types'
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
