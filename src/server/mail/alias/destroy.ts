import 'server-only'
import { ForwardMailAlias, MailAlias, RawAddressMailAlias } from '@prisma/client';
import { prismaCall } from '../../prismaCall';
import prisma from '@/prisma';
import { CreateMailAliasForwardRelationTypes, createMailAliasForwardRelationValidation, destoryMailAliasValidation } from './validation';


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

export async function destroyMailAliasForward(rawdata: CreateMailAliasForwardRelationTypes['Detailed']): Promise<ForwardMailAlias> {
    const parse = createMailAliasForwardRelationValidation.detailedValidate(rawdata)

    return await prismaCall(() => prisma.forwardMailAlias.delete({
        where: {
            sourceId_drainId: parse
        }
    }))
}