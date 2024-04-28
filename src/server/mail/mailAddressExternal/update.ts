import 'server-only'
import { UpdatemailAddressExternalTypes, updateMailAddressExternalValidation } from './validation';
import { MailAddressExternal } from '@prisma/client';
import { prismaCall } from '@/server/prismaCall';
import prisma from '@/prisma';


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