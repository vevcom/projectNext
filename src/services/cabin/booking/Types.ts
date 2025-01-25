import type { bookingFieldsToExpose } from './ConfigVars'
import type { Booking } from '@prisma/client'

export type BookingFiltered = Pick<Booking, typeof bookingFieldsToExpose[number]>
