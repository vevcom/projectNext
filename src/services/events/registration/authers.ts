import { RequirePermissioAndUser } from '@/auth/auther/RequirePermissionAndUser'
import { RequireUserIdOrPermission } from '@/auth/auther/RequireUserIdOrPermission'

export namespace EventRegistrationAuthers {
    // TODO: Fix authing
    export const create = RequireUserIdOrPermission.staticFields({ permission: 'EVENT_REGISTRATION_CREATE' })
    export const readMany = RequirePermissioAndUser.staticFields({ permission: 'EVENT_REGISTRATION_READ' })
}
