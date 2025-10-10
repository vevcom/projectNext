import { RequirePermission } from '@/auth/auther/RequirePermission'
import { RequirePermissionAndUser } from '@/auth/auther/RequirePermissionAndUser'
import { RequireUser } from '@/auth/auther/RequireUser'
import { RequireUserIdOrPermission } from '@/auth/auther/RequireUserIdOrPermission'

export const eventRegistrationAuthers = {
    // TODO: Fix authing
    create: RequireUserIdOrPermission.staticFields({ permission: 'EVENT_REGISTRATION_CREATE' }),
    createGuest: RequirePermission.staticFields({ permission: 'EVENT_ADMIN' }),
    readMany: RequirePermissionAndUser.staticFields({ permission: 'EVENT_REGISTRATION_READ' }),
    readManyDetailed: RequirePermissionAndUser.staticFields({ permission: 'EVENT_REGISTRATION_READ' }),
    destroy: RequirePermissionAndUser.staticFields({ permission: 'EVENT_REGISTRATION_DESROY' }),

    updateRegistrationNotes: RequireUser.staticFields({}), // TODO: bypass permission
}
