import { NotificationChannelSubscription } from "@/server/notifications/Types";

export type SubscriptionThreeObject = NotificationChannelSubscription & {
    children: SubscriptionThreeObject[]
}