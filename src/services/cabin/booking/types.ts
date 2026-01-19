import type { cabinBookingFieldsToExpose } from './constants'
import type { Booking } from '@/prisma-generated-pn-types'

export type BookingFiltered = Pick<Booking, typeof cabinBookingFieldsToExpose[number]>
