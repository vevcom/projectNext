import type { bookingFieldsToExpose } from './config'
import type { Booking } from '@prisma/client'

export type BookingFiltered = Pick<Booking, typeof bookingFieldsToExpose[number]>
