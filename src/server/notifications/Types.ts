import type { NotificationChannel, NotificationMethod } from "@prisma/client";

export type NotificationChannelWithMethods = Omit<NotificationChannel, 'availableMethodsId' | 'defaultMethodsId'> & {
    availableMethods: Omit<NotificationMethod, 'id'>;
    defaultMethods?: Omit<NotificationMethod, 'id'>;
};