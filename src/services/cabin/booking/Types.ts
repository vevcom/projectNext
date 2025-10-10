import type { cabinBookingFieldsToExpose } from './config'
import type { Booking } from '@prisma/client'

export type BookingFiltered = Pick<Booking, typeof cabinBookingFieldsToExpose[number]>
