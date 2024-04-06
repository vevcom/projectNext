import 'server-only'
import { createMailAliasValidation, type CreateMailAliasTypes } from './validation';
import { prismaCall } from '@/server/prismaCall';
import prisma from '@/prisma';
import { MailAlias } from '@prisma/client';

export async function createMailAlias(rawdata: CreateMailAliasTypes['Detailed']):
    Promise<MailAlias>
{
    const parsedData = createMailAliasValidation.detailedValidate(rawdata)

    return await prismaCall(() => prisma.mailAlias.create({
        data: parsedData,
    }))
}