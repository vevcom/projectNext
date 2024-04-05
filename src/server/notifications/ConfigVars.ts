import { Prisma } from '@prisma/client';
import type { NotificationMethod } from '@prisma/client';
import type { NotificationChannel, SpecialNotificationChannel } from '@prisma/client';
import type { NotificationChannelWithMethods } from './Types';

export const NotificationMethods = Object
    .keys(Prisma.NotificationMethodScalarFieldEnum)
    .filter(v => v != 'id') as (keyof Omit<NotificationMethod, 'id'>)[];

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
        availableMethods: channel.availableMethods ? remove_id(channel.availableMethods) : NotificationMethodsAllOn,
        defaultMethods: channel.defaultMethods ? remove_id(channel.defaultMethods) : undefined,
    }
}

export const NotificationMethodsAllOn = Object.fromEntries(
    NotificationMethods.map((method) => [method, true])
) as Omit<NotificationMethod, "id">;

export const NotificationMethodsAllOff = Object.fromEntries(
    NotificationMethods.map((method) => [method, false])
) as Omit<NotificationMethod, "id">;

export function NotificationMethodDisplayName(key: keyof(Omit<NotificationMethod, "id">)): string {
    const mapping = {
        email: "Epost",
        push: "Push varsling",
        emailWeekly: "Ukentlig epost",
    } as Record<keyof(NotificationMethod), string>

    return mapping[key] ?? key
}