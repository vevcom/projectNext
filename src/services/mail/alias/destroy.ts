import '@pn-server-only'
import { destoryMailAliasValidation } from './validation'
import { prismaCall } from '@/services/prismaCall'
import { prisma } from '@/prisma-pn-client-instance'
import { ServerError } from '@/services/error'
import type { MailAlias } from '@/prisma-generated-pn-types'


export async function destroyMailAlias(id: number): Promise<MailAlias> {
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
        throw new ServerError('BAD PARAMETERS', 'Cannot delete a mailAlias that is connected to a notification channel.')
    }


    return await prismaCall(() => prisma.mailAlias.delete({
        where: {
            id: parse.id,
        },
    }))
}
