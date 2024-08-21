import 'server-only'
import { readMailAddressExternalValidation } from './validation'
import { prismaCall } from '@/services/prismaCall'
import prisma from '@/prisma'
import type { MailAddressExternal } from '@prisma/client'


export async function destroyMailAddressExternal(id: number): Promise<MailAddressExternal> {
    const parse = readMailAddressExternalValidation.detailedValidate({ id })

    return await prismaCall(() => prisma.mailAddressExternal.delete({
        where: {
            id: parse.id,
        },
    }))
}
