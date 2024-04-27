import { NotificationChannel } from "@/server/notifications/Types";
import { Subscription } from "@/server/notifications/subscription/Types";


export type NotificationBranch = NotificationChannel & {
    children: NotificationBranch[],
    subscription?: Subscription,
}