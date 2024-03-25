import { Prisma } from '@prisma/client';
import type { NotificationMethod } from '@prisma/client';
import type { NotificationChannel, SpecialNotificationChannel } from '@prisma/client';
import type { NotificationChannelWithMethods } from './Types';

export const NotificationMethods = Object
    .keys(Prisma.NotificationMethodScalarFieldEnum)
    .filter(v => v != 'id') as (keyof NotificationMethod)[];

export const NotificationMethodTypes = ['availableMethods', 'defaultMethods'] as const;

export function convertFromPrismaMethods(
    channel : Omit<NotificationChannel, "availableMethods" | "defaultMethods"> & {
        availableMethods: NotificationMethod | null,
        defaultMethods: NotificationMethod | null,
    }): NotificationChannelWithMethods {

    const remove_id = (channel: NotificationMethod) => {
        const { id, ...rest } = channel
        return rest
    }

    return {
        ...channel,
        availableMethods: channel.availableMethods ? remove_id(channel.availableMethods) : undefined,
        defaultMethods: channel.defaultMethods ? remove_id(channel.defaultMethods) : undefined,
    }
}
