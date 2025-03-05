import { createSelection } from '@/services/createSelection'
import type { Booking } from '@prisma/client'

export namespace CabinBookingConfig {

    export const bookingFieldsToExpose = ['start', 'end', 'type'] as const satisfies (keyof Booking)[]

    export const bookingFilerSelection = createSelection(bookingFieldsToExpose)
}

