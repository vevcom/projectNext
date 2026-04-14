import { emailSchemas } from './schemas'
import { DEFAULT_NOTIFICATION_ALIAS } from '@/lib/email/constants'
import { sendBulkMail } from '@/lib/email/send'
import { repalceSpecialSymbols } from '@/services/notifications/operations'
import { prismaCall } from '@/services/prismaCall'
import { prisma } from '@/prisma-pn-client-instance'
import { wrapInHTML } from '@/lib/email/wrapInHTML'
import type { ExpandedNotificationChannel } from '@/services/notifications/types'
import type { Notification } from '@/prisma-generated-pn-types'
import type { UserFiltered } from '@/services/users/types'


export async function dispatchEmailNotifications(
    channel: ExpandedNotificationChannel,
    notificaion: Notification,
    users: UserFiltered[]
) {
    console.log('Email')

    console.log(channel)

    console.log(notificaion)

    console.log(users)

    const results = await prismaCall(() => prisma.notificationChannel.findUniqueOrThrow({
        where: {
            id: channel.id,
        },
        select: {
            mailAlias: true,
        },
    }))

    const senderAlias = results.mailAlias ? results.mailAlias.address : DEFAULT_NOTIFICATION_ALIAS

    const mails = await Promise.all(users.map(async user => {
        const parsed = emailSchemas.sendMail.parse({
            from: senderAlias,
            to: user.email,
            subject: repalceSpecialSymbols(notificaion.title, user),
            text: repalceSpecialSymbols(notificaion.message, user),
        })

        return {
            from: parsed.from,
            to: parsed.to,
            subject: parsed.subject,
            html: await wrapInHTML(user, parsed.text),
            list: {
                unsubscribe: {
                    url: `https://${process.env.DOMAIN}/users/${user.username}/unsubscribe`,
                    comment: 'Comment'
                },
            }
        }
    }))

    console.log(mails)

    await sendBulkMail(mails)
}
