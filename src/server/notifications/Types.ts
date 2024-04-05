import type { NotificationChannel, NotificationMethod, NotificationSubscription } from "@prisma/client";

export type NotificationChannelWithMethods = Omit<NotificationChannel, 'availableMethodsId' | 'defaultMethodsId'> & {
    availableMethods: Omit<NotificationMethod, 'id'> & {
        [key: string]: boolean;
    };
    defaultMethods?: Omit<NotificationMethod, 'id'> & {
        [key: string]: boolean;
    };
};

export type NotificationMethodType = 'availableMethods' | 'defaultMethods';

export type NotificationSubscriptionWithMethods = NotificationSubscription & {
    methods: Omit<NotificationMethod, 'id'>
}

export type NotificationChannelSubscription = NotificationChannelWithMethods & {
    subscription?: NotificationSubscriptionWithMethods
}
