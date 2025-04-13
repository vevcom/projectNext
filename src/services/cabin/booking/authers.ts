import { RequirePermission } from '@/auth/auther/RequirePermission'
import { RequirePermissionAndUserId } from '@/auth/auther/RequirePermissionAndUserId'

export namespace CabinBookingAuthers {
    export const createCabinBookingUserAttached = RequirePermissionAndUserId.staticFields({
        permission: 'CABIN_BOOKING_CABIN_CREATE'
    })

    export const createCabinBookingNoUser = RequirePermission.staticFields({
        permission: 'CABIN_BOOKING_CABIN_CREATE'
    })

    export const createBedBookingUserAttached = RequirePermissionAndUserId.staticFields({
        permission: 'CABIN_BOOKING_BED_CREATE'
    })

    export const createBedBookingNoUser = RequirePermission.staticFields({
        permission: 'CABIN_BOOKING_BED_CREATE'
    })

    export const readAvailability = RequirePermission.staticFields({
        permission: 'CABIN_CALENDAR_READ'
    })

    export const readMany = RequirePermission.staticFields({
        permission: 'CABIN_BOOKING_ADMIN'
    })

    export const read = RequirePermission.staticFields({
        permission: 'CABIN_BOOKING_ADMIN'
    })
}

