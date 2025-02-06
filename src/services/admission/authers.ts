import { RequireNothing } from '@/auth/auther/RequireNothing'
import { RequirePermissioAndUser } from '@/auth/auther/RequirePermissionAndUser'

export const admissionAuthers = {
    createTrial: RequirePermissioAndUser.staticFields({
        permission: 'ADMISSION_TRIAL_CREATE',
    }),
    readTrial: RequireNothing.staticFields({})
}
