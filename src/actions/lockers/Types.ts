import type { Locker } from '@prisma/client'

export type LockerWithReservation = Locker & {
    LockerReservation: {
        user: {
            firstname: string;
            lastname: string;
        };
    }[];
}