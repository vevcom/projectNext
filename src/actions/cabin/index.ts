'use server'
import { action } from '@/actions/action'
import { CabinBookingMethods } from '@/services/cabin/booking/methods'
import { CabinPricePeriodMethods } from '@/services/cabin/pricePeriod/methods'
import { CabinProductMethods } from '@/services/cabin/product/methods'
import { CabinReleasePeriodMethods } from '@/services/cabin/releasePeriod/methods'

export const createReleasePeriodAction = action(CabinReleasePeriodMethods.create)
export const readReleasePeriodsAction = action(CabinReleasePeriodMethods.readMany)
export const updateReleasePeriodAction = action(CabinReleasePeriodMethods.update)
export const destroyReleasePeriodAction = action(CabinReleasePeriodMethods.destroy)

export const createPricePeriodAction = action(CabinPricePeriodMethods.create)
export const destoryPricePeriodAction = action(CabinPricePeriodMethods.destroy)
export const readPricePeriodsAction = action(CabinPricePeriodMethods.readMany)
export const readPublicPricePeriodsAction = action(CabinPricePeriodMethods.readPublicPeriods)
export const readUnreleasedPricePeriodsAction = action(CabinPricePeriodMethods.readUnreleasedPeriods)

export const createCabinBookingUserAttachedAction = action(CabinBookingMethods.createCabinBookingUserAttached)
export const createBedBookingUserAttachedAction = action(CabinBookingMethods.createBedBookingUserAttached)
export const createCabinBookingNoUserAction = action(CabinBookingMethods.createCabinBookingNoUser)
export const createBedBookingNoUserAction = action(CabinBookingMethods.createBedBookingNoUser)
export const readCabinAvailabilityAction = action(CabinBookingMethods.readAvailability)
export const readCabinBookingsAction = action(CabinBookingMethods.readMany)
export const readCabinBookingAction = action(CabinBookingMethods.read)

export const readCabinProductsAction = action(CabinProductMethods.readMany)
export const readCabinProductsActiveAction = action(CabinProductMethods.readActive)
export const readCabinProductAction = action(CabinProductMethods.read)
export const createCabinProductAction = action(CabinProductMethods.create)
export const createCabinProductPriceAction = action(CabinProductMethods.createPrice)
