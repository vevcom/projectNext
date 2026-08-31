import { RequirePermissionOrGroupAdmin } from '@/auth/authorizer/RequirePermissionOrGroupAdmin'

export const committeeParticipationAuth = {
    read: RequirePermissionOrGroupAdmin.staticFields({ permission: 'APPLICATION_ADMIN' }),
    readAll: RequirePermissionOrGroupAdmin.staticFields({ permission: 'APPLICATION_ADMIN' }),
}
