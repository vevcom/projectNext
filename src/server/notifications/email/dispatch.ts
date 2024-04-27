import { UserFiltered } from "@/server/users/Types";
import { NotificationChannel } from "../Types";
import { Notification } from "@prisma/client";




export async function dispatchEmailNotifications(channel: NotificationChannel, notificaion: Notification, users: UserFiltered[]) {
    console.log("Email")

    console.log(channel)

    console.log(notificaion)

    console.log(users)
}