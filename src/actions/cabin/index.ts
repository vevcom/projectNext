'use server'
import { action } from '@/actions/action'
import { CabinBookingMethods } from '@/services/cabin/booking/methods'
import { CabinPricePeriodMethods } from '@/services/cabin/pricePeriod/methods'
import { CabinProductMethods } from '@/services/cabin/product/methods'
import { CabinReleasePeriodMethods } from '@/services/cabin/releasePeriod/methods'

export const createReleasePeriodAction = action(CabinReleasePeriodMethods.create)
export const readReleasePeriodsAction = action(CabinReleasePeriodMethods.readMany)
export const updateReleasePeriodAction = action(CabinReleasePeriodMethods.update)
export const deleteReleasePeriodAction = action(CabinReleasePeriodMethods.destroy)

export const createPricePeriodAction = action(CabinPricePeriodMethods.create)
export const readPricePeriodsAction = action(CabinPricePeriodMethods.readMany)

export const createCabinBookinUserAttachedAction = action(CabinBookingMethods.createCabinBookingUserAttached)
export const createBedBookinUserAttachedAction = action(CabinBookingMethods.createBedBookingUserAttached)
export const readCabinAvailabilityAction = action(CabinBookingMethods.readAvailability)
export const readCabinBookingsAction = action(CabinBookingMethods.readMany)
export const readCabinBookingAction = action(CabinBookingMethods.read)

export const readCabinProductsAction = action(CabinProductMethods.readMany)
export const readCabinProductAction = action(CabinProductMethods.read)
export const createCabinProductAction = action(CabinProductMethods.create)
export const createCabinProductPriceAction = action(CabinProductMethods.createPrice)
