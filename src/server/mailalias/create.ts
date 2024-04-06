import 'server-only'
import { createMailAliasValidation, type CreateMailAliasTypes, CreateMailAliasRawAddressTypes, createMailAliasRawAddressValidation } from './validation';
import { prismaCall } from '@/server/prismaCall';
import prisma from '@/prisma';
import { MailAlias, RawAddressMailAlias } from '@prisma/client';

export async function createMailAlias(rawdata: CreateMailAliasTypes['Detailed']):
    Promise<MailAlias>
{
    const parsedData = createMailAliasValidation.detailedValidate(rawdata)

    return await prismaCall(() => prisma.mailAlias.create({
        data: parsedData,
    }))
}

export async function createMailAliasRawAddress(rawdata: CreateMailAliasRawAddressTypes['Detailed']):
    Promise<RawAddressMailAlias>
{
    const { id, rawAddress } = createMailAliasRawAddressValidation.detailedValidate(rawdata)

    return await prismaCall(() => prisma.rawAddressMailAlias.create({
        data: {
            address: rawAddress,
            alias: {
                connect: {
                    id,
                },
            },
        }
    }))
}