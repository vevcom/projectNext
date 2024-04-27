import { UserFiltered } from "@/server/users/Types";
import { NotificationChannel } from "../Types";
import { Notification } from "@prisma/client";




export async function dispatchPushNotifications(channel: NotificationChannel, notificaion: Notification, users: UserFiltered[]) {
    console.log("Push")

    console.log(channel)

    console.log(notificaion)

    console.log(users)
}