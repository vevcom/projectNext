import { RequirePermission } from '@/auth/auther/RequirePermission'
import { RequirePermissionAndUser } from '@/auth/auther/RequirePermissionAndUser'
import { RequireUser } from '@/auth/auther/RequireUser'
import { RequireUserIdOrPermission } from '@/auth/auther/RequireUserIdOrPermission'

export namespace EventRegistrationAuthers {
    // TODO: Fix authing
    export const create = RequireUserIdOrPermission.staticFields({ permission: 'EVENT_REGISTRATION_CREATE' })
    export const createGuest = RequirePermission.staticFields({ permission: 'EVENT_ADMIN' })
    export const readMany = RequirePermissionAndUser.staticFields({ permission: 'EVENT_REGISTRATION_READ' })
    export const readManyDetailed = RequirePermissionAndUser.staticFields({ permission: 'EVENT_REGISTRATION_READ' })
    export const destroy = RequirePermissionAndUser.staticFields({ permission: 'EVENT_REGISTRATION_DESROY' })

    export const updateRegistrationNotes = RequireUser.staticFields({}) // TODO: bypass permission
}
