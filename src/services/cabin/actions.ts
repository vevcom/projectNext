'use server'

import { cabinReleasePeriodMethods } from './releasePeriod/methods'
import { cabinPricePeriodMethods } from './pricePeriod/methods'
import { cabinBookingMethods } from './booking/methods'
import { cabinProductMethods } from './product/methods'
import { action } from '@/services/action'

export const createReleasePeriodAction = action(cabinReleasePeriodMethods.create)
export const readReleasePeriodsAction = action(cabinReleasePeriodMethods.readMany)
export const updateReleasePeriodAction = action(cabinReleasePeriodMethods.update)
export const destroyReleasePeriodAction = action(cabinReleasePeriodMethods.destroy)

export const createPricePeriodAction = action(cabinPricePeriodMethods.create)
export const destoryPricePeriodAction = action(cabinPricePeriodMethods.destroy)
export const readPricePeriodsAction = action(cabinPricePeriodMethods.readMany)
export const readPublicPricePeriodsAction = action(cabinPricePeriodMethods.readPublicPeriods)
export const readUnreleasedPricePeriodsAction = action(cabinPricePeriodMethods.readUnreleasedPeriods)

export const createCabinBookingUserAttachedAction = action(cabinBookingMethods.createCabinBookingUserAttached)
export const createBedBookingUserAttachedAction = action(cabinBookingMethods.createBedBookingUserAttached)
export const createCabinBookingNoUserAction = action(cabinBookingMethods.createCabinBookingNoUser)
export const createBedBookingNoUserAction = action(cabinBookingMethods.createBedBookingNoUser)
export const readCabinAvailabilityAction = action(cabinBookingMethods.readAvailability)
export const readCabinBookingsAction = action(cabinBookingMethods.readMany)
export const readCabinBookingAction = action(cabinBookingMethods.read)

export const readCabinProductsAction = action(cabinProductMethods.readMany)
export const readCabinProductsActiveAction = action(cabinProductMethods.readActive)
export const readCabinProductAction = action(cabinProductMethods.read)
export const createCabinProductAction = action(cabinProductMethods.create)
export const createCabinProductPriceAction = action(cabinProductMethods.createPrice)
