import { RequireNothing } from '@/auth/auther/RequireNothing'
import { RequirePermission } from '@/auth/auther/RequirePermission'

export const flairAuth = {
    edit: RequirePermission.staticFields({ permission: 'PERMISSION_FLAIR_EDIT' }),
    read: RequireNothing.staticFields({}),
}
