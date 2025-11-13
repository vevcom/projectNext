'use server'

import { cabinReleasePeriodOperations } from './releasePeriod/operations'
import { cabinPricePeriodOperations } from './pricePeriod/operations'
import { cabinBookingOperations } from './booking/operations'
import { cabinProductOperations } from './product/operations'
import { makeAction } from '@/services/serverAction'

export const createReleasePeriodAction = makeAction(cabinReleasePeriodOperations.create)
export const readReleasePeriodsAction = makeAction(cabinReleasePeriodOperations.readMany)
export const updateReleasePeriodAction = makeAction(cabinReleasePeriodOperations.update)
export const destroyReleasePeriodAction = makeAction(cabinReleasePeriodOperations.destroy)

export const createPricePeriodAction = makeAction(cabinPricePeriodOperations.create)
export const destoryPricePeriodAction = makeAction(cabinPricePeriodOperations.destroy)
export const readPricePeriodsAction = makeAction(cabinPricePeriodOperations.readMany)
export const readPublicPricePeriodsAction = makeAction(cabinPricePeriodOperations.readPublicPeriods)
export const readUnreleasedPricePeriodsAction = makeAction(cabinPricePeriodOperations.readUnreleasedPeriods)

export const createCabinBookingUserAttachedAction = makeAction(cabinBookingOperations.createCabinBookingUserAttached)
export const createBedBookingUserAttachedAction = makeAction(cabinBookingOperations.createBedBookingUserAttached)
export const createCabinBookingNoUserAction = makeAction(cabinBookingOperations.createCabinBookingNoUser)
export const createBedBookingNoUserAction = makeAction(cabinBookingOperations.createBedBookingNoUser)
export const readCabinAvailabilityAction = makeAction(cabinBookingOperations.readAvailability)
export const readCabinBookingsAction = makeAction(cabinBookingOperations.readMany)
export const readCabinBookingAction = makeAction(cabinBookingOperations.read)

export const readSpecialCmsParagraphCabinContractAction = makeAction(
    cabinBookingOperations.readSpecialCmsParagraphCabinContract
)
export const updateSpecialCmsParagraphCabinContractAction = makeAction(
    cabinBookingOperations.updateSpecialCmsParagraphContentCabinContract
)

export const readCabinProductsAction = makeAction(cabinProductOperations.readMany)
export const readCabinProductsActiveAction = makeAction(cabinProductOperations.readActive)
export const readCabinProductAction = makeAction(cabinProductOperations.read)
export const createCabinProductAction = makeAction(cabinProductOperations.create)
export const createCabinProductPriceAction = makeAction(cabinProductOperations.createPrice)
