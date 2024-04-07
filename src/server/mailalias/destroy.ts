import 'server-only'
import { MailAlias, RawAddressMailAlias } from '@prisma/client';
import { prismaCall } from '../prismaCall';
import prisma from '@/prisma';
import { destoryMailAliasValidation } from './validation';


export async function destroyMailAliasById(id: number): Promise<MailAlias> {
    const parse = destoryMailAliasValidation.detailedValidate({ id })

    return await prismaCall(() => prisma.mailAlias.delete({
        where: {
            id: parse.id,
        },
    }))
}

export async function destroyMailAliasRawAddress(id: number): Promise<RawAddressMailAlias> {
    const parse = destoryMailAliasValidation.detailedValidate({ id })

    return await prismaCall(() => prisma.rawAddressMailAlias.delete({
        where: {
            id: parse.id,
        }
    }))
}