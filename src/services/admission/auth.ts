import { RequireNothing } from '@/auth/authorizer/RequireNothing'
import { RequirePermissionAndUser } from '@/auth/authorizer/RequirePermissionAndUser'

export const admissionAuth = {
    createTrial: RequirePermissionAndUser.staticFields({
        permission: 'ADMISSION_TRIAL_CREATE',
    }),
    readTrial: RequireNothing.staticFields({}),
}
