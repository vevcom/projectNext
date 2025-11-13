import { AutherFactory } from './Auther'
import type { Permission } from '@prisma/client'

export const RequirePermissionOrGroupAdmin = AutherFactory<
    { permission: Permission },
    { groupId: number },
    'USER_NOT_REQUIERED_FOR_AUTHORIZED'
>(({ session, staticFields, dynamicFields }) => ({
    success: session.permissions.includes(staticFields.permission) || session.memberships.some(
        membersip => membersip.groupId === dynamicFields.groupId && membersip.admin && membersip.active
    ),
    session,
    errorMessage: `
        Du trenger tillatelse '${staticFields.permission}' for å få tilgang eller 
        være gruppeleder for gruppe ${dynamicFields.groupId}
    `
}))
