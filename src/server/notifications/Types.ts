import type { NotificationChannel, NotificationMethod } from "@prisma/client";

export type NotificationChannelWithMethods = Omit<NotificationChannel, 'availableMethodsId' | 'defaultMethodsId'> & {
    availableMethods?: Omit<NotificationMethod, 'id'> & {
        [key: string]: boolean;
    };
    defaultMethods?: Omit<NotificationMethod, 'id'> & {
        [key: string]: boolean;
    };
};

export type NotificationMethodType = 'availableMethods' | 'defaultMethods';
