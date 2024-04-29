import 'server-only'
import { MailAddressExternal } from '@prisma/client';
import { prismaCall } from '@/server/prismaCall';
import prisma from '@/prisma';
import { readMailAddressExternalValidation } from './validation';


export async function destroyMailAddressExternal(id: number): Promise<MailAddressExternal> {
    const parse = readMailAddressExternalValidation.detailedValidate({ id })

    return await prismaCall(() => prisma.mailAddressExternal.delete({
        where: {
            id: parse.id,
        },
    }))
}