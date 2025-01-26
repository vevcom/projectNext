import { RequirePermission } from '@/auth/auther/RequirePermission'
import { RequirePermissionAndUserId } from '@/auth/auther/RequirePermissionAndUserId'

export const createReleasePeriodAuther = RequirePermission.staticFields({ permission: 'CABIN_ADMIN' })
export const readReleasePeriodAuther = RequirePermission.staticFields({ permission: 'CABIN_ADMIN' })
export const updateReleasePeriodAuther = RequirePermission.staticFields({ permission: 'CABIN_ADMIN' })
export const deleteReleasePeriodAuther = RequirePermission.staticFields({ permission: 'CABIN_ADMIN' })

export const createCabinBookingUserAttachedAuther = RequirePermissionAndUserId.staticFields({
    permission: 'CABIN_BOOKING_CREATE'
})

export const readBookingsAuther = RequirePermission.staticFields({
    permission: 'CABIN_BOOKING_CREATE'
})

export const readCabinProductAuther = RequirePermission.staticFields({
    permission: 'CABIN_CALENDAR_READ'
})

export const createCabinProductAuther = RequirePermission.staticFields({
    permission: 'CABIN_PRODUCTS_ADMIN'
})

export const createCabinProductPriceAuther = RequirePermission.staticFields({
    permission: 'CABIN_PRODUCTS_ADMIN'
})
