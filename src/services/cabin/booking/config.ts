import { createSelection } from '@/services/createSelection'
import { UserConfig } from '@/services/users/config'
import type { Booking } from '@prisma/client'

export namespace CabinBookingConfig {

    export const bookingFieldsToExpose = ['start', 'end', 'type'] as const satisfies (keyof Booking)[]

    export const bookingFilerSelection = createSelection(bookingFieldsToExpose)

    export const bookingIncluder = {
        user: {
            select: UserConfig.filterSelection,
        },
        BookingProduct: {
            include: {
                product: true,
            }
        },
        event: true,
        guestUser: true,
    }

}

