import { RequireNothing } from '@/auth/auther/RequireNothing'
import { RequirePermissionAndUser } from '@/auth/auther/RequirePermissionAndUser'

export const admissionAuthers = {
    createTrial: RequirePermissionAndUser.staticFields({
        permission: 'ADMISSION_TRIAL_CREATE',
    }),
    readTrial: RequireNothing.staticFields({}),
}
