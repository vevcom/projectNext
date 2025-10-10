import { createSelection } from '@/services/createSelection'
import { userFilterSelection } from '@/services/users/config'
import type { Booking } from '@prisma/client'

export const cabinBookingFieldsToExpose = ['start', 'end', 'type'] as const satisfies (keyof Booking)[]

export const cabinBookingFilerSelection = createSelection(cabinBookingFieldsToExpose)

export const cabinBookingIncluder = {
    user: {
        select: userFilterSelection,
    },
    BookingProduct: {
        include: {
            product: true,
        }
    },
    event: true,
    guestUser: true,
}

