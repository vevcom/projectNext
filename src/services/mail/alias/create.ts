import '@pn-server-only'
import { createMailAliasValidation, type CreateMailAliasTypes } from './validation'
import { prismaCall } from '@/services/prismaCall'
import { prisma } from '@/prisma/client'
import type { MailAlias } from '@prisma/client'

export async function createMailAlias(rawdata: CreateMailAliasTypes['Detailed']):
    Promise<MailAlias> {
    const parsedData = createMailAliasValidation.detailedValidate(rawdata)

    return await prismaCall(() => prisma.mailAlias.create({
        data: parsedData,
    }))
}
