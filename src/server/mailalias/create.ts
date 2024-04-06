import 'server-only'
import { createMailAliasValidation, type CreateMailAliasTypes, CreateMailAliasRawAddressTypes, createMailAliasRawAddressValidation, CreateMailAliasForwardRelationTypes, createMailAliasForwardRelationValidation } from './validation';
import { prismaCall } from '@/server/prismaCall';
import prisma from '@/prisma';
import { ForwardMailAlias, MailAlias, RawAddressMailAlias } from '@prisma/client';
import { findValidMailAliasForwardRelations } from './read';
import { ServerError } from '../error';

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

export async function createMailAliasForwardRelation(rawdata: CreateMailAliasForwardRelationTypes['Detailed']):
    Promise<ForwardMailAlias>
{
    const { sourceId, drainId } = createMailAliasForwardRelationValidation.detailedValidate(rawdata)

    const validRelations = await findValidMailAliasForwardRelations(sourceId)
    if (!validRelations.map(r => r.id).includes(drainId)) throw new ServerError('BAD PARAMETERS', 'Cannot set mailforwarding in a loop.')

    return await prismaCall(() => prisma.forwardMailAlias.create({
        data: {
            sourceId,
            drainId,
        }
    }))
}