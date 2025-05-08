import { RequirePermission } from '@/auth/auther/RequirePermission'
import { RequirePermissioAndUser } from '@/auth/auther/RequirePermissionAndUser'
import { RequireUser } from '@/auth/auther/RequireUser'
import { RequireUserIdOrPermission } from '@/auth/auther/RequireUserIdOrPermission'

export namespace EventRegistrationAuthers {
    // TODO: Fix authing
    export const create = RequireUserIdOrPermission.staticFields({ permission: 'EVENT_REGISTRATION_CREATE' })
    export const readMany = RequirePermissioAndUser.staticFields({ permission: 'EVENT_REGISTRATION_READ' })
    export const readManyDetailed = RequirePermissioAndUser.staticFields({ permission: 'EVENT_REGISTRATION_READ' })
    export const destroy = RequirePermission.staticFields({ permission: 'EVENT_ADMIN' })

    export const updateRegistrationNotes = RequireUser.staticFields({}) // TODO: bypass permission
}
