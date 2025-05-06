import '@pn-server-only'
import { updateMailAliasValidation, type UpdateMailAliasTypes } from './validation'
import { prismaCall } from '@/services/prismaCall'
import prisma from '@/prisma'
import type { MailAlias } from '@prisma/client'

export async function updateMailAlias(rawdata: UpdateMailAliasTypes['Detailed']): Promise<MailAlias> {
    const parse = updateMailAliasValidation.detailedValidate(rawdata)

    return await prismaCall(() => prisma.mailAlias.update({
        where: {
            id: parse.id,
        },
        data: {
            address: parse.address,
            description: parse.description,
        }
    }))
}
