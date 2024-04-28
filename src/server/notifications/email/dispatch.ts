import { UserFiltered } from "@/server/users/Types";
import { NotificationChannel } from "../Types";
import { Notification } from "@prisma/client";
import { sendBulkMail } from "./send";
import { prismaCall } from "@/server/prismaCall";
import { DEFAULT_NOTIFICATION_ALIAS } from "./ConfigVars";


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

    const mails = users.map(u => ({
        from: senderAlias,
        to: u.email,
        subject: notificaion.title,
        text: notificaion.message,
    }))

    console.log(mails)

    await sendBulkMail(mails);
}