import type { cabinBookingFieldsToExpose } from './constants'
import type { Booking } from '@prisma/client'

export type BookingFiltered = Pick<Booking, typeof cabinBookingFieldsToExpose[number]>
