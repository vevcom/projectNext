import { UserFiltered } from "@/server/users/Types";
import { NotificationChannel } from "../Types";
import { Notification } from "@prisma/client";
import { sendBulkMail } from "./send";
import { prismaCall } from "@/server/prismaCall";
import { DEFAULT_NOTIFICATION_ALIAS } from "./ConfigVars";
import { sendEmailValidation } from "./validation";
import { render } from '@react-email/render';
import { DefaultEmailTemplate } from "./mailTemplates";
import { repalceSpecialSymbols } from "../dispatch";


export async function dispatchEmailNotifications(channel: NotificationChannel, notificaion: Notification, users: UserFiltered[]) {
    console.log("Email")

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

    const mails = users.map(u => {
        const parsed = sendEmailValidation.detailedValidate({
            from: senderAlias,
            to: u.email,
            subject: repalceSpecialSymbols(notificaion.title, u),
            text: repalceSpecialSymbols(notificaion.message, u),
        })

        return {
            from: parsed.from,
            to: parsed.to,
            subject: parsed.subject,
            html: wrapInHTML(u, parsed.text),
            list: {
                unsubscribe: {
                    url: `https://${process.env.DOMAIN}/users/${u.username}/unsubscribe`,
                    comment: 'Comment'
                },
            }
        }
    })

    console.log(mails)

    await sendBulkMail(mails);
}

function wrapInHTML(user: UserFiltered, text: string): string {
    return render(<DefaultEmailTemplate user={user} text={text} />)
}