import { UserFiltered } from "@/server/users/Types";
import { NotificationChannel } from "../Types";
import { Notification } from "@prisma/client";
import { sendMail } from "./send";


export async function dispatchEmailNotifications(channel: NotificationChannel, notificaion: Notification, users: UserFiltered[]) {
    console.log("Email")

    console.log(channel)

    console.log(notificaion)

    console.log(users)

    await Promise.all(users.map(async u => {
        await sendMail({
            sender: "noreply@omega.ntnu.no",
            recipient: u.email,
            subject: notificaion.title,
            text: notificaion.message,
        });
    }))
}