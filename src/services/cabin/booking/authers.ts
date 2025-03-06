import { RequirePermission } from '@/auth/auther/RequirePermission'
import { RequirePermissionAndUserId } from '@/auth/auther/RequirePermissionAndUserId'

export namespace CabinBookingAuthers {
    export const createUserAttached = RequirePermissionAndUserId.staticFields({
        permission: 'CABIN_BOOKING_CREATE'
    })

    export const readAvailability = RequirePermission.staticFields({
        permission: 'CABIN_BOOKING_CREATE'
    })

    export const readMany = RequirePermission.staticFields({
        permission: 'CABIN_BOOKING_ADMIN'
    })

    export const read = RequirePermission.staticFields({
        permission: 'CABIN_BOOKING_ADMIN'
    })
}

