'use server'

import { cabinReleasePeriodOperations } from './releasePeriod/operations'
import { cabinPricePeriodOperations } from './pricePeriod/operations'
import { cabinBookingOperations } from './booking/operations'
import { cabinProductOperations } from './product/operations'
import { action } from '@/services/action'

export const createReleasePeriodAction = action(cabinReleasePeriodOperations.create)
export const readReleasePeriodsAction = action(cabinReleasePeriodOperations.readMany)
export const updateReleasePeriodAction = action(cabinReleasePeriodOperations.update)
export const destroyReleasePeriodAction = action(cabinReleasePeriodOperations.destroy)

export const createPricePeriodAction = action(cabinPricePeriodOperations.create)
export const destoryPricePeriodAction = action(cabinPricePeriodOperations.destroy)
export const readPricePeriodsAction = action(cabinPricePeriodOperations.readMany)
export const readPublicPricePeriodsAction = action(cabinPricePeriodOperations.readPublicPeriods)
export const readUnreleasedPricePeriodsAction = action(cabinPricePeriodOperations.readUnreleasedPeriods)

export const createCabinBookingUserAttachedAction = action(cabinBookingOperations.createCabinBookingUserAttached)
export const createBedBookingUserAttachedAction = action(cabinBookingOperations.createBedBookingUserAttached)
export const createCabinBookingNoUserAction = action(cabinBookingOperations.createCabinBookingNoUser)
export const createBedBookingNoUserAction = action(cabinBookingOperations.createBedBookingNoUser)
export const readCabinAvailabilityAction = action(cabinBookingOperations.readAvailability)
export const readCabinBookingsAction = action(cabinBookingOperations.readMany)
export const readCabinBookingAction = action(cabinBookingOperations.read)

export const readCabinProductsAction = action(cabinProductOperations.readMany)
export const readCabinProductsActiveAction = action(cabinProductOperations.readActive)
export const readCabinProductAction = action(cabinProductOperations.read)
export const createCabinProductAction = action(cabinProductOperations.create)
export const createCabinProductPriceAction = action(cabinProductOperations.createPrice)
