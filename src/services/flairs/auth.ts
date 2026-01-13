import { RequirePermission } from '@/auth/authorizer/RequirePermission'
import { RequireNothing } from '@/auth/authorizer/RequireNothing'

export const flairAuth = {
    edit: RequirePermission.staticFields({ permission: 'PERMISSION_FLAIR_EDIT' }),
    read: RequireNothing.staticFields({}),
}
