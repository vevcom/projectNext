import type { NotificationChannel, NotificationMethod, NotificationSubscription } from "@prisma/client";

export const NotificationMethodTypes = ['availableMethods', 'defaultMethods'] as const;
export type NotificationMethodType = typeof NotificationMethodTypes[number];

export type NotificationChannelWithMethods = Omit<NotificationChannel, NotificationMethodType> & {
    availableMethods: Omit<NotificationMethod, 'id'> & {
        [key: string]: boolean;
    };
    defaultMethods?: Omit<NotificationMethod, 'id'> & {
        [key: string]: boolean;
    };
};

export type NotificationSubscriptionWithMethods = NotificationSubscription & {
    methods: Omit<NotificationMethod, 'id'>
}

export type NotificationChannelSubscription = NotificationChannelWithMethods & {
    subscription?: NotificationSubscriptionWithMethods
}
