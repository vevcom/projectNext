import { sendBulkMail } from './send'
import { DEFAULT_NOTIFICATION_ALIAS } from './constants'
import { sendEmailValidation } from './validation'
import { DefaultEmailTemplate } from './templates/default'
import { repalceSpecialSymbols } from '@/services/notifications/operations'
import { prismaCall } from '@/services/prismaCall'
import { prisma } from '@/prisma/client'
import { render } from '@react-email/render'
import type { ExpandedNotificationChannel } from '@/services/notifications/types'
import type { Notification } from '@prisma/client'
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
        const parsed = sendEmailValidation.detailedValidate({
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

async function wrapInHTML(user: UserFiltered, text: string): Promise<string> {
    // TODO: Would it be possible to do React.createElement here?
    // It feels cursed to write TSX in backend code.
    return render(<DefaultEmailTemplate user={user} text={text} />)
}
