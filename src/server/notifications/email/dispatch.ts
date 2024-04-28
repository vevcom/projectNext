import { UserFiltered } from "@/server/users/Types";
import { NotificationChannel } from "../Types";
import { Notification } from "@prisma/client";
import { sendBulkMail, sendMail } from "./send";


export async function dispatchEmailNotifications(channel: NotificationChannel, notificaion: Notification, users: UserFiltered[]) {
    console.log("Email")

    console.log(channel)

    console.log(notificaion)

    console.log(users)

    const mails = users.map(u => ({
        from: "noreply@omega.ntnu.no",
        to: u.email,
        subject: notificaion.title,
        text: notificaion.message,
    }))

    sendBulkMail(mails);
}