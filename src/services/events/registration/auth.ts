import { RequirePermission } from '@/auth/authorizer/RequirePermission'
import { RequirePermissionAndUser } from '@/auth/authorizer/RequirePermissionAndUser'
import { RequireUser } from '@/auth/authorizer/RequireUser'
import { RequireUserIdOrPermission } from '@/auth/authorizer/RequireUserIdOrPermission'

export const eventRegistrationAuth = {
    // TODO: Fix authing
    create: RequireUserIdOrPermission.staticFields({ permission: 'EVENT_REGISTRATION_CREATE' }),
    createGuest: RequirePermission.staticFields({ permission: 'EVENT_ADMIN' }),
    readMany: RequirePermissionAndUser.staticFields({ permission: 'EVENT_REGISTRATION_READ' }),
    readManyDetailed: RequirePermissionAndUser.staticFields({ permission: 'EVENT_REGISTRATION_READ' }),
    destroy: RequirePermissionAndUser.staticFields({ permission: 'EVENT_REGISTRATION_DESROY' }),

    updateRegistrationNotes: RequireUser.staticFields({}), // TODO: bypass permission
}
