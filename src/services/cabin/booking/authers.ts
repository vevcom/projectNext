import { RequirePermission } from '@/auth/auther/RequirePermission'
import { RequirePermissionAndUser } from '@/auth/auther/RequirePermissionAndUser'

export namespace CabinBookingAuthers {
    export const createCabinBookingUserAttached = RequirePermissionAndUser.staticFields({
        permission: 'CABIN_BOOKING_CABIN_CREATE'
    })

    export const createBedBookingUserAttached = RequirePermissionAndUser.staticFields({
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

