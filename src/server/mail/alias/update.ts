import 'server-only'
import { updateMailAliasValidation, type UpdateMailAliasTypes } from './validation'
import { MailAlias } from '@prisma/client'
import { prismaCall } from '../../prismaCall'
import prisma from '@/prisma'

export async function updateMailAlias(rawdata: UpdateMailAliasTypes['Detailed']): Promise<MailAlias> {

    const parse = updateMailAliasValidation.detailedValidate(rawdata);

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