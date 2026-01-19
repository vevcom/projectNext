import '@pn-server-only'
import { createMailAliasValidation, type CreateMailAliasTypes } from './validation'
import { prismaCall } from '@/services/prismaCall'
import { prisma } from '@/prisma-pn-client-instance'
import type { MailAlias } from '@/prisma-generated-pn-types'

export async function createMailAlias(rawdata: CreateMailAliasTypes['Detailed']):
    Promise<MailAlias> {
    const parsedData = createMailAliasValidation.detailedValidate(rawdata)

    return await prismaCall(() => prisma.mailAlias.create({
        data: parsedData,
    }))
}
