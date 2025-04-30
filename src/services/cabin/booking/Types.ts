import type { CabinBookingConfig } from './config'
import type { Booking } from '@prisma/client'

export type BookingFiltered = Pick<Booking, typeof CabinBookingConfig.bookingFieldsToExpose[number]>
