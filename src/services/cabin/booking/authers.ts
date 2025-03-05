import { RequirePermission } from '@/auth/auther/RequirePermission'
import { RequirePermissionAndUserId } from '@/auth/auther/RequirePermissionAndUserId'

export namespace CabinBookingAuthers {
    export const createCabinBookingUserAttachedAuther = RequirePermissionAndUserId.staticFields({
        permission: 'CABIN_BOOKING_CREATE'
    })

    export const readBookingsAuther = RequirePermission.staticFields({
        permission: 'CABIN_BOOKING_CREATE'
    })
}

