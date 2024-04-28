import 'server-only'
import { MailAlias } from '@prisma/client';
import { prismaCall } from '../../prismaCall';
import prisma from '@/prisma';
import { destoryMailAliasValidation } from './validation';
import { ServerError } from '@/server/error';


export async function destroyMailAliasById(id: number): Promise<MailAlias> {
    const parse = destoryMailAliasValidation.detailedValidate({ id })

    const connectedToNotificationChannel = await prismaCall(() => prisma.mailAlias.findUniqueOrThrow({
        where: {
            id: parse.id,
        },
        select: {
            notificationChannel: true,
        }
    }))

    if (connectedToNotificationChannel.notificationChannel.length) {
        throw new ServerError("BAD PARAMETERS", "Cannot delete a mailAlias that is connected to a notification channel.")
    }


    return await prismaCall(() => prisma.mailAlias.delete({
        where: {
            id: parse.id,
        },
    }))
}